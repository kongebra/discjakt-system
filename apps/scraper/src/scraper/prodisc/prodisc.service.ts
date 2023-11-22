import { Injectable } from '@nestjs/common';
import { BaseScraperService } from '../base-scraper.service';
import { IScraper, IScraperConfig, ScrapeResult } from '../scraper.interface';
import { load, CheerioAPI } from 'cheerio';

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
    if (result.data.image.startsWith('//')) {
      result.data.image = 'https:' + result.data.image;
    }

    [result.data.price, result.data.originalPrice] = this.parsePrice($);
    result.data.category = $(this.config.selectors.category)
      .first()
      .text()
      .trim();
    result.data.brand = $(this.config.selectors.brand).first().text().trim();
    [result.data.inStock, result.data.quantity] = this.parseStock($);

    [result.data.speed, result.data.glide, result.data.turn, result.data.fade] =
      this.parseFlightRatings($);

    return result;
  }

  private parseFlightRatings($: CheerioAPI): [number, number, number, number] {
    const speed = parseFloat($(this.config.selectors.speed).text().trim()) || 0;
    const glide = parseFloat($(this.config.selectors.glide).text().trim()) || 0;
    const turn = parseFloat($(this.config.selectors.turn).text().trim()) || 0;
    const fade = parseFloat($(this.config.selectors.fade).text().trim()) || 0;

    return [speed, glide, turn, fade];
  }

  private parseStock($: CheerioAPI): [boolean, number] {
    const inStockText = $(this.config.selectors.inStock).first().text().trim();
    // "N på lager"
    const quantity = parseInt(inStockText.split(' ')[0]);

    return [quantity > 0, quantity];
  }

  private parsePrice($: CheerioAPI): [number, number] {
    const priceStr = $(this.config.selectors.price).first().text().trim();
    const price = this.priceParser.parse(priceStr);

    const originalPriceStr = $(this.config.selectors.originalPrice)
      .first()
      .text()
      .trim();
    if (originalPriceStr) {
      const originalPrice = this.priceParser.parse(originalPriceStr);
      return [price, originalPrice];
    }

    return [price, price];
  }
}
