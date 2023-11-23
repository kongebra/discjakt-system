import { Injectable } from '@nestjs/common';
import { CheerioAPI } from 'cheerio';
import { BaseScraperService } from '../base-scraper.service';
import { IScraper, IScraperConfig, ScrapeResult } from '../scraper.interface';

@Injectable()
export class KrokholdgsService extends BaseScraperService implements IScraper {
  config: IScraperConfig = {
    baseUrl: 'https://krokholdgs.no',
    domain: 'krokholdgs.no',
    name: 'krokholdgs',
    crawlDelay: 5,
    selectors: {
      name: '.product-title-v1',
      image: '.swiper-container.swiper-product img',
      price: '.product-price',
      category: '.breadcrumb a:nth-child(2)',
      brand: 'span[itemprop="brand"] img',
      inStock: '.product_stock.stock_box',
    },
  };

  public async scrape(url: string): Promise<ScrapeResult> {
    const [$, result] = await this.fetch(url);
    if ($ === null) {
      return result;
    }

    result.data.name = $(this.config.selectors.name).first().text().trim();
    result.data.image = $(this.config.selectors.image).first().attr('src');
    [result.data.price, result.data.originalPrice] = this.parsePrice($);
    result.data.category = $(this.config.selectors.category)
      .first()
      .text()
      .trim();
    result.data.brand = $(this.config.selectors.brand).first().attr('alt');
    [result.data.inStock, result.data.quantity] = this.parseStock($);

    return result;
  }

  private parseStock($: CheerioAPI): [boolean, number] {
    const inStockText = $(this.config.selectors.inStock).first().text().trim();
    // "N på lager"
    const inStock = inStockText.toLowerCase().includes('på lager');
    const quantity = parseInt(inStockText.split(' ')[0]);

    return [inStock, quantity];
  }

  private parsePrice($: CheerioAPI): [number, number] {
    const priceStr = $(this.config.selectors.price).first().text().trim();
    const price = this.priceParser.parse(priceStr);

    return [price, price];
  }
}
