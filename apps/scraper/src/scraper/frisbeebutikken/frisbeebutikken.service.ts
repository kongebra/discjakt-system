import { Injectable } from '@nestjs/common';
import { CheerioAPI } from 'cheerio';
import { BaseScraperService } from '../base-scraper.service';
import { IScraper, IScraperConfig, ScrapeResult } from '../scraper.interface';

@Injectable()
export class FrisbeebutikkenService
  extends BaseScraperService
  implements IScraper
{
  config: IScraperConfig = {
    baseUrl: 'https://www.frisbeebutikken.no',
    crawlDelay: 5,
    domain: 'frisbeebutikken.no',
    name: 'frisbeebutikken',
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

  public async scrape(url: string): Promise<ScrapeResult> {
    return this.tracer.startActiveSpan(
      'frisbeebutikken.scrape',
      async (span) => {
        try {
          const [$, result] = await this.fetch(url);
          if ($ === null) {
            return result;
          }

          result.data.name = $(this.config.selectors.name)
            .first()
            .text()
            .trim();
          result.data.brand = $(this.config.selectors.brand)
            .first()
            .text()
            .trim();
          result.data.category = $(this.config.selectors.category)
            .first()
            .text()
            .trim();
          result.data.image = $(this.config.selectors.image)
            .first()
            .attr('src');
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
      },
    );
  }

  private parsePrice($: CheerioAPI): [number, number] {
    return this.tracer.startActiveSpan('frisbeebutikken.parsePrice', () => {
      const priceStr = $(this.config.selectors.price).first().text().trim();
      const originalPriceStr = $(this.config.selectors.originalPrice)
        .first()
        .text()
        .trim();

      if (!originalPriceStr) {
        const price = this.priceParser.parse(priceStr);

        return [price, price] as [number, number];
      }

      return [
        this.priceParser.parse(priceStr),
        this.priceParser.parse(originalPriceStr),
      ] as [number, number];
    });
  }

  private parseStock($: CheerioAPI): [boolean, number] {
    return this.tracer.startActiveSpan('frisbeebutikken.parseStock', () => {
      const stockText = $(this.config.selectors.inStock).first().text().trim();

      const parts = stockText.split(':');
      if (parts.length < 2) {
        return [false, 0] as [boolean, number];
      }

      const quantity = parseInt(parts[1].trim(), 10);
      if (isNaN(quantity)) {
        return [false, 0] as [boolean, number];
      }

      return [quantity > 0, quantity] as [boolean, number];
    });
  }
}
