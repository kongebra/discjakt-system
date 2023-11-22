import { Injectable } from '@nestjs/common';
import { BaseScraperService } from '../base-scraper.service';
import { IScraper, IScraperConfig, ScrapeResult } from '../scraper.interface';
import { load, CheerioAPI } from 'cheerio';

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
    result.data.brand = $(this.config.selectors.brand)
      .first()
      .attr('content')
      .trim();
    result.data.image = $(this.config.selectors.image).first().attr('src');

    [result.data.speed, result.data.glide, result.data.turn, result.data.fade] =
      this.parseStats($);

    [result.data.price, result.data.originalPrice] = this.parsePrice($);

    [result.data.inStock, result.data.quantity] = this.parseStock($);

    return result;
  }
  private parseStock($: CheerioAPI): [boolean, number] {
    const inStockText = $(this.config.selectors.inStock).first().attr('href');
    const inStock = inStockText === 'http://schema.org/InStock';

    return [inStock, 0];
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

  private parseStats($: CheerioAPI): [number, number, number, number] {
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

    return [speed, glide, turn, fade];
  }
}
