import { Injectable } from '@nestjs/common';
import { CheerioAPI } from 'cheerio';
import { BaseScraperService } from '../base-scraper.service';
import { IScraper, IScraperConfig, ScrapeResult } from '../scraper.interface';

@Injectable()
export class GolfkongenService extends BaseScraperService implements IScraper {
  config: IScraperConfig = {
    baseUrl: 'https://www.golfkongen.no',
    crawlDelay: 5,
    domain: 'golfkongen.no',
    name: 'golfkongen',
    selectors: {
      name: 'h1[itemprop="name"]',
      brand: 'meta[itemprop="brand"]',
      image: '.productpage-image',
      price: '.qs-product-price',
      originalPrice: '.product-before-price',
      inStock: 'link[itemprop="availability"]',
    },
  };
  public async scrape(url: string): Promise<ScrapeResult> {
    return this.tracer.startActiveSpan('golfkongen.scrape', async (span) => {
      try {
        const [$, result] = await this.fetch(url);
        if ($ === null) {
          return result;
        }

        result.data.name = $(this.config.selectors.name).first().text().trim();
        result.data.brand = $(this.config.selectors.brand)
          .first()
          .attr('content')
          .trim();
        result.data.image = $(this.config.selectors.image).first().attr('src');

        [
          result.data.speed,
          result.data.glide,
          result.data.turn,
          result.data.fade,
        ] = this.parseStats($);

        [result.data.price, result.data.originalPrice] = this.parsePrice($);

        [result.data.inStock, result.data.quantity] = this.parseStock($);

        span.setAttributes({
          'product.name': result.data.name,
          'product.brand': result.data.brand,
          'product.category': result.data.category,
          'product.image': result.data.image,
          'product.price': result.data.price,
          'product.originalPrice': result.data.originalPrice,
          'product.inStock': result.data.inStock,
          'product.quantity': result.data.quantity,
          'product.speed': result.data.speed,
          'product.glide': result.data.glide,
          'product.turn': result.data.turn,
          'product.fade': result.data.fade,
        });

        return result;
      } catch (err) {
        span.setAttributes({
          'error.type': err.name,
          'error.message': err.message,
          'error.stack': err.stack,
        });

        throw err;
      } finally {
        span.end();
      }
    });
  }

  private parseStock($: CheerioAPI): [boolean, number] {
    return this.tracer.startActiveSpan('golfkongen.parseStock', () => {
      const inStockText = $(this.config.selectors.inStock).first().attr('href');
      const inStock = inStockText === 'http://schema.org/InStock';

      return [inStock, 0] as [boolean, number];
    });
  }

  private parsePrice($: CheerioAPI): [number, number] {
    return this.tracer.startActiveSpan('golfkongen.parsePrice', () => {
      const priceStr = $(this.config.selectors.price).first().text().trim();
      const price = this.priceParser.parse(priceStr);

      const originalPriceStr = $(this.config.selectors.originalPrice)
        .first()
        .text()
        .trim();
      if (originalPriceStr) {
        const originalPrice = this.priceParser.parse(originalPriceStr);
        return [price, originalPrice] as [number, number];
      }

      return [price, price] as [number, number];
    });
  }

  private parseStats($: CheerioAPI): [number, number, number, number] {
    return this.tracer.startActiveSpan('golfkongen.parseStats', () => {
      let speed = 0,
        glide = 0,
        turn = 0,
        fade = 0;

      const speedStr = $('#description table tr td:nth-of-type(1)')
        .text()
        .replace('Speed: ', '')
        .trim();
      const glideStr = $('#description table tr td:nth-of-type(2)')
        .text()
        .replace('Glide: ', '')
        .trim();
      const turnStr = $('#description table tr td:nth-of-type(3)')
        .text()
        .replace('Turn: ', '')
        .trim();
      const fadeStr = $('#description table tr td:nth-of-type(4)')
        .text()
        .replace('Fade: ', '')
        .trim();

      speed = parseFloat(speedStr) || 0;
      glide = parseFloat(glideStr) || 0;
      turn = parseFloat(turnStr) || 0;
      fade = parseFloat(fadeStr) || 0;

      return [speed, glide, turn, fade] as [number, number, number, number];
    });
  }
}
