import { Injectable } from '@nestjs/common';
import { BaseScraperService } from '../base-scraper.service';
import { IScraper, IScraperConfig, ScrapeResult } from '../scraper.interface';
import { CheerioAPI, load } from 'cheerio';

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
    const response = await this.http.axiosRef.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'DiscjaktBot',
      },
    });

    const result: ScrapeResult = {
      data: {
        url,
        retailerSlug: this.config.name,

        name: '',
        image: '',
        inStock: false,
        quantity: 0,
        brand: '',
        category: '',
        price: 0,
        originalPrice: 0,
        speed: 0,
        glide: 0,
        turn: 0,
        fade: 0,
      },

      meta: {
        url,
        retailerSlug: this.config.name,
        scraperName: this.config.name,
        scrapedAt: new Date(),
        httpStatus: response.status,
        httpStatusText: response.statusText,
      },
    };

    if (response.status !== 200) {
      return result;
    }

    const html = response.data.toString('latin1');
    const $ = load(html);

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