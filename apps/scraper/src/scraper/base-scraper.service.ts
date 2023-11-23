import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CheerioAPI, load } from 'cheerio';
import { TracerService } from '../core/tracer/tracer.service';
import { PriceParserService } from '../utils/price-parser/price-parser.service';
import { IScraperConfig, ScrapeResult } from './scraper.interface';

@Injectable()
export abstract class BaseScraperService {
  constructor(
    protected readonly http: HttpService,
    protected readonly tracer: TracerService,
    protected readonly priceParser: PriceParserService,
  ) {}

  protected abstract config: IScraperConfig;

  protected async fetch(
    url: string,
    encoding: 'utf8' | 'latin1' = 'utf8',
  ): Promise<[CheerioAPI, ScrapeResult]> {
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
      return [null, result];
    }

    const html = response.data.toString(encoding);
    const $ = load(html);

    return [$, result];
  }
}
