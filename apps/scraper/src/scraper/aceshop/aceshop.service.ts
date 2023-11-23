import { Injectable, Logger } from '@nestjs/common';
import { CheerioAPI } from 'cheerio';
import { BaseScraperService } from '../base-scraper.service';
import { IScraper, IScraperConfig, ScrapeResult } from '../scraper.interface';

@Injectable()
export class AceshopService extends BaseScraperService implements IScraper {
  private readonly logger = new Logger(AceshopService.name);

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
    const [$, result] = await this.fetch(url);
    if ($ === null) {
      return result;
    }

    result.data.name = $(this.config.selectors.name).first().text().trim();
    result.data.brand = $(this.config.selectors.brand).first().text().trim();
    result.data.category = $(this.config.selectors.category)
      .first()
      .text()
      .trim();
    result.data.image = $(this.config.selectors.image).first().attr('src');

    [result.data.price, result.data.originalPrice] = this.parsePrice($);

    [result.data.inStock, result.data.quantity] = this.parseStock($);

    [result.data.speed, result.data.glide, result.data.turn, result.data.fade] =
      this.parseStats($);

    return result;
  }

  private parseStats($: CheerioAPI): [number, number, number, number] {
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

    return [speed, glide, turn, fade];
  }

  private parsePrice($: CheerioAPI): [number, number] {
    const priceStr = $(this.config.selectors.price).first().text().trim();
    const originalPriceStr = $(this.config.selectors.originalPrice)
      .first()
      .text()
      .trim();

    if (!originalPriceStr) {
      const price = this.priceParser.parse(priceStr);

      return [price, price];
    }

    return [
      this.priceParser.parse(priceStr),
      this.priceParser.parse(originalPriceStr),
    ];
  }

  private parseStock($: CheerioAPI): [boolean, number] {
    const stockText = $(this.config.selectors.inStock).first().text().trim();

    const parts = stockText.split(':');
    if (parts.length < 2) {
      return [false, 0];
    }

    const quantity = parseInt(parts[1].trim(), 10);
    if (isNaN(quantity)) {
      return [false, 0];
    }

    return [quantity > 0, quantity];
  }
}
