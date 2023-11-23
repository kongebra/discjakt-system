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
    return this.tracer.startActiveSpan('base-scraper.fetch', async (span) => {
      try {
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

        span.setAttributes({
          'http.url': url,
          'http.response.status': response.status,
          'http.response.statusText': response.statusText,
          'scraper.name': this.config.name,
        });

        if (response.status !== 200) {
          return [null, result] as [CheerioAPI, ScrapeResult];
        }

        const html = response.data.toString(encoding);
        const $ = load(html);

        return [$, result] as [CheerioAPI, ScrapeResult];
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
}
