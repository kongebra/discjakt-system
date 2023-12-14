import { Injectable } from '@nestjs/common';
import { CheerioAPI } from 'cheerio';
import { BaseScraperService } from '../base-scraper.service';
import { IScraper, IScraperConfig, ScrapeResult } from '../scraper.interface';

@Injectable()
export class ProdiscService extends BaseScraperService implements IScraper {
  config: IScraperConfig = {
    baseUrl: 'https://www.prodisc.no',
    crawlDelay: 5,
    domain: 'prodisc.no',
    name: 'prodisc',
    selectors: {
      name: '.product__title h1',
      brand: 'product-info p.product__text',
      category: '',
      image: '.product__media img',
      price: '.price__sale .price-item.price-item--sale',
      originalPrice: '.price__sale .price-item.price-item--regular',
      inStock: '.product__inventory',
      speed: '.box-container-product .flightbox-1',
      glide: '.box-container-product .flightbox-2',
      turn: '.box-container-product .flightbox-3',
      fade: '.box-container-product .flightbox-4',
    },
  };

  public async scrape(url: string): Promise<ScrapeResult> {
    return this.tracer.startActiveSpan('prodisc.scrape', async (span) => {
      try {
        const [$, result] = await this.fetch(url);
        if ($ === null) {
          return result;
        }

        result.data.name = $(this.config.selectors.name).first().text().trim();
        result.data.image = $(this.config.selectors.image).first().attr('src');
        if (result.data.image.startsWith('//')) {
          result.data.image = 'https:' + result.data.image;
        }

        [result.data.price, result.data.originalPrice] = this.parsePrice($);
        // result.data.category = $(this.config.selectors.category)
        //   .first()
        //   .text()
        //   .trim();
        result.data.brand = $(this.config.selectors.brand)
          .first()
          .text()
          .trim();
        [result.data.inStock, result.data.quantity] = this.parseStock($);

        [
          result.data.speed,
          result.data.glide,
          result.data.turn,
          result.data.fade,
        ] = this.parseFlightRatings($);

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

  private parseFlightRatings($: CheerioAPI): [number, number, number, number] {
    return this.tracer.startActiveSpan('prodisc.parseFlightRatings', (span) => {
      const speed =
        parseFloat($(this.config.selectors.speed).text().trim()) || 0;
      const glide =
        parseFloat($(this.config.selectors.glide).text().trim()) || 0;
      const turn = parseFloat($(this.config.selectors.turn).text().trim()) || 0;
      const fade = parseFloat($(this.config.selectors.fade).text().trim()) || 0;

      span.end();

      return [speed, glide, turn, fade] as [number, number, number, number];
    });
  }

  private parseStock($: CheerioAPI): [boolean, number] {
    return this.tracer.startActiveSpan('prodisc.parseStock', (span) => {
      const inStockText = $(this.config.selectors.inStock)
        .first()
        .text()
        .trim();
      // "N på lager"
      const quantity = parseInt(inStockText.split(' ')[0]);

      span.end();

      return [quantity > 0, quantity] as [boolean, number];
    });
  }

  private parsePrice($: CheerioAPI): [number, number] {
    return this.tracer.startActiveSpan('prodisc.parsePrice', (span) => {
      const priceStr = $(this.config.selectors.price).first().text().trim();
      const price = this.priceParser.parse(priceStr);

      const originalPriceStr = $(this.config.selectors.originalPrice)
        .first()
        .text()
        .trim();
      if (originalPriceStr) {
        const originalPrice = this.priceParser.parse(originalPriceStr);
        span.end();
        return [price, originalPrice] as [number, number];
      }

      span.end();

      return [price, price] as [number, number];
    });
  }
}
