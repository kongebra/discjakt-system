import { Injectable } from '@nestjs/common';
import { BaseScraperService } from '../base-scraper.service';
import { IScraper, IScraperConfig, ScrapeResult } from '../scraper.interface';
import { CheerioAPI } from 'cheerio';

@Injectable()
export class FrisbeeSorService extends BaseScraperService implements IScraper {
  config: IScraperConfig = {
    baseUrl: 'https://frisbeesor.no',
    name: 'frisbee-sor',
    crawlDelay: 1,
    domain: 'frisbeesor.no',
    selectors: {
      name: 'h1.product-title',
      image: '.product-gallery-slider img',
      price: '.woocommerce-Price-amount',
      category: '.product_meta .posted_in a',
      inStock: '.stock.out-of-stock',
    },
  };

  public async scrape(url: string): Promise<ScrapeResult> {
    return this.tracer.startActiveSpan('frisbee-sor.scrape', async (span) => {
      try {
        const [$, result] = await this.fetch(url);
        if ($ === null) {
          return result;
        }

        result.data.name = $(this.config.selectors.name).text().trim();
        result.data.image = $(this.config.selectors.image).first().attr('src');

        [result.data.price, result.data.originalPrice] = this.parsePrice($);

        [
          result.data.speed,
          result.data.glide,
          result.data.turn,
          result.data.fade,
        ] = this.parseFlightRatings($);

        [result.data.brand, result.data.category] =
          this.parseBrandAndCategory($);

        result.data.inStock = !$(this.config.selectors.inStock).length;
        const inStockText = $('.stock.in-stock').text().trim();
        if (inStockText) {
          result.data.inStock = true;
          const parts = inStockText.split(' ');
          if (parts.length > 0) {
            result.data.quantity = parseInt(parts[0]);
          }
        }

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

  private parseBrandAndCategory($: CheerioAPI): [string, string] {
    return this.tracer.startActiveSpan(
      'frisbee-sor.parseBrandAndCategory',
      (span) => {
        let brand = '',
          category = '';

        const categories: string[] = [];

        $(this.config.selectors.category).each((_, el) => {
          const href = $(el).attr('href');

          if (href.includes('/merker/')) {
            brand = $(el).text().trim();
          }

          categories.push($(el).text().trim());
        });

        category = categories.join(',');

        span.end();

        return [brand, category] as [string, string];
      },
    );
  }

  private parseFlightRatings($: CheerioAPI): [number, number, number, number] {
    return this.tracer.startActiveSpan(
      'frisbee-sor.parseFlightRatings',
      (span) => {
        let speed = 0,
          glide = 0,
          turn = 0,
          fade = 0;

        const description = $('.woocommerce-Tabs-panel--description')
          .text()
          .trim();

        // Adjusted regular expressions for each flight spec
        const speedRegex = /Speed:?\s*(\d+(?:,\d+)?)/;
        const glideRegex = /Glide:?\s*(\d+(?:,\d+)?)/;
        const turnRegex = /Turn:?\s*(-?\d+(?:,\d+)?)/;
        const fadeRegex = /Fade:?\s*(-?\d+(?:,\d+)?)/;

        // Search for each flight spec
        const speedMatch = description.match(speedRegex);
        const glideMatch = description.match(glideRegex);
        const turnMatch = description.match(turnRegex);
        const fadeMatch = description.match(fadeRegex);

        // Function to parse number with comma as decimal separator
        const parseNumber = (str) =>
          parseFloat(str?.replace(',', '.') || '0') || 0;

        // Extract and assign the values
        speed = parseNumber(speedMatch?.[1]);
        glide = parseNumber(glideMatch?.[1]);
        turn = parseNumber(turnMatch?.[1]);
        fade = parseNumber(fadeMatch?.[1]);

        span.end();

        return [speed, glide, turn, fade] as [number, number, number, number];
      },
    );
  }

  private parsePrice($: CheerioAPI): [number, number] {
    return this.tracer.startActiveSpan('frisbee-sor.parsePrice', (span) => {
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
