import { Injectable } from '@nestjs/common';
import { CheerioAPI } from 'cheerio';
import { BaseScraperService } from '../base-scraper.service';
import { IScraper, IScraperConfig, ScrapeResult } from '../scraper.interface';

@Injectable()
export class AceshopService extends BaseScraperService implements IScraper {
  readonly config: IScraperConfig = {
    name: 'aceshop',
    domain: 'aceshop.no',
    baseUrl: 'https://aceshop.no',
    crawlDelay: 5,
    selectors: {
      name: '.product-title-v1',
      brand: 'span[itemprop="brand"]',
      category: '.breadcrumb a:nth-of-type(2)',
      image: 'img.img-fluid.fit-prod-page.fit-prod-page5050',
      price: '.product-price',
      originalPrice: '.products_price_old',
      inStock: '.product_stock',
    },
  };

  async scrape(url: string): Promise<ScrapeResult> {
    return this.tracer.startActiveSpan('aceshop.scrape', async (span) => {
      try {
        const [$, result] = await this.fetch(url, 'latin1');
        if ($ === null) {
          return result;
        }

        result.data.name = $(this.config.selectors.name).first().text().trim();
        result.data.brand = $(this.config.selectors.brand)
          .first()
          .text()
          .trim();
        result.data.category = $(this.config.selectors.category)
          .first()
          .text()
          .trim();
        result.data.image = $(this.config.selectors.image).first().attr('src');

        [result.data.price, result.data.originalPrice] = this.parsePrice($);

        [result.data.inStock, result.data.quantity] = this.parseStock($);

        [
          result.data.speed,
          result.data.glide,
          result.data.turn,
          result.data.fade,
        ] = this.parseStats($);

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

  private parseStats($: CheerioAPI): [number, number, number, number] {
    return this.tracer.startActiveSpan('aceshop.parseStats', (span) => {
      let speed = 0,
        glide = 0,
        turn = 0,
        fade = 0;

      $('script[type="text/javascript"]').each((_, el) => {
        const scriptContent = $(el).html() || '';

        const speedMatch = scriptContent.match(/"Speed":\s*"(\d+(\.\d+)?)"/);
        const glideMatch = scriptContent.match(/"Glide":\s*"(\d+(\.\d+)?)"/);
        const turnMatch = scriptContent.match(/"Turn":\s*"(\d+(\.\d+)?)"/);
        const fadeMatch = scriptContent.match(/"Fade":\s*"(\d+(\.\d+)?)"/);

        if (speedMatch) {
          speed = parseFloat(speedMatch[1]);
        }
        if (glideMatch) {
          glide = parseFloat(glideMatch[1]);
        }
        if (turnMatch) {
          turn = parseFloat(turnMatch[1]);
        }
        if (fadeMatch) {
          fade = parseFloat(fadeMatch[1]);
        }

        if (speed || glide || turn || fade) {
          return false;
        }
      });

      span.end();

      return [speed, glide, turn, fade] as [number, number, number, number];
    });
  }

  private parsePrice($: CheerioAPI): [number, number] {
    return this.tracer.startActiveSpan('aceshop.parsePrice', (span) => {
      const priceStr = $(this.config.selectors.price).first().text().trim();
      const originalPriceStr = $(this.config.selectors.originalPrice)
        .first()
        .text()
        .trim();

      if (!originalPriceStr) {
        const price = this.priceParser.parse(priceStr);

        span.end();

        return [price, price] as [number, number];
      }

      span.end();

      return [
        this.priceParser.parse(priceStr),
        this.priceParser.parse(originalPriceStr),
      ] as [number, number];
    });
  }

  private parseStock($: CheerioAPI): [boolean, number] {
    return this.tracer.startActiveSpan('aceshop.parseStock', (span) => {
      const stockText = $(this.config.selectors.inStock).first().text().trim();

      const parts = stockText.split(':');
      if (parts.length < 2) {
        span.end();

        return [false, 0] as [boolean, number];
      }

      const quantity = parseInt(parts[1].trim(), 10);
      if (isNaN(quantity)) {
        span.end();

        return [false, 0] as [boolean, number];
      }

      span.end();

      return [quantity > 0, quantity] as [boolean, number];
    });
  }
}
