import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { CheerioAPI, load } from 'cheerio';
import { PriceParserService } from '../price-parser/price-parser.service';
import { SELECTORS } from './selectors';
import { Span, trace } from '@opentelemetry/api';

const tracer = trace.getTracer('scraper_app');

type ScrapeResult = {
  status: number;
  statusText: string;

  title: string | null;
  description: string | null;
  price: number | null;
  image_url: string | null;
};

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    private readonly http: HttpService,
    private readonly priceParser: PriceParserService,
  ) {}

  public async scrape(url: string): Promise<ScrapeResult> {
    return tracer.startActiveSpan('scrape', async (span) => {
      span.setAttribute('scrape.url', url);

      try {
        const response = await this.http.axiosRef.get(url, {
          headers: {
            'User-Agent': 'DiscjaktBot',
          },
        });

        const result: ScrapeResult = {
          title: '',
          description: '',
          price: 0,
          image_url: '',

          status: response.status,
          statusText: response.statusText,
        };

        span.setAttributes({
          'scrape.http.status': result.status,
          'scrape.http.statusText': result.statusText,
        });

        if (response.status !== 200) {
          return result;
        }

        const html = response.data;
        const $ = load(html);

        result.title = this.extractValue(
          $,
          SELECTORS.METADATA.PRODUCT.NAME,
          SELECTORS.PRODUCT.NAME,
          'text',
          true,
          url,
          span,
        ) as string | null;

        result.description = this.extractValue(
          $,
          SELECTORS.METADATA.PRODUCT.DESCRIPTION,
          SELECTORS.PRODUCT.DESCRIPTION,
          'text',
          true,
          url,
          span,
        ) as string | null;

        result.price = this.extractValue(
          $,
          SELECTORS.METADATA.PRODUCT.PRICE,
          SELECTORS.PRODUCT.PRICE,
          'price',
          true,
          url,
          span,
        ) as number | null;

        result.image_url = this.extractValue(
          $,
          SELECTORS.METADATA.PRODUCT.IMAGE_URL,
          SELECTORS.PRODUCT.IMAGE_URL,
          'src',
          true,
          url,
          span,
        ) as string | null;

        span.setAttributes({
          'scrape.title': result.title,
          'scrape.description': result.description,
          'scrape.price': result.price,
          'scrape.image_url': result.image_url,
        });

        return result;
      } catch (error) {
        span.setAttributes({
          'scrape.error.name': error.name,
          'scrape.error.message': error.message,
          'scrape.error.status': error?.response.status,
          'scrape.error.statusText': error?.response.statusText,
          'scrape.error': error.message,
          'scrape.error.stack': error.stack,
        });

        return {
          title: null,
          description: null,
          price: null,
          image_url: null,

          status: error?.response?.status,
          statusText: error?.response?.statusText,
        } satisfies ScrapeResult;
      } finally {
        span.end();
      }
    });
  }

  private extractValue(
    $: CheerioAPI,
    metadataSelectors: readonly string[],
    productSelectors: readonly string[],
    type: 'text' | 'price' | 'src',
    isMetadata: boolean = false,
    url: string,
    span: Span,
  ): string | number | null {
    let value = this.extractFromSelectors(
      $,
      metadataSelectors,
      type,
      isMetadata,
      span,
    );

    if (!value || (url.includes('wearediscgolf.no') && type === 'src')) {
      value = this.extractFromSelectors($, productSelectors, type, false, span);
    }

    return value;
  }

  private extractFromSelectors(
    $: CheerioAPI,
    selectors: readonly string[],
    type: 'text' | 'price' | 'src',
    isMetadata: boolean = false,
    span: Span,
  ): string | number | null {
    for (const selector of selectors) {
      let value: string | null = null;

      if (isMetadata) {
        value = $(selector).attr('content');
      } else {
        switch (type) {
          case 'text':
          case 'price':
            value = $(selector).text().trim();
            span.setAttribute(`scrape.selector.${selector}`, value);
            break;
          case 'src':
            value = $(selector).attr('src');
            span.setAttribute(`scrape.selector.${selector}`, value);
            break;
        }
      }

      if (value) {
        switch (type) {
          case 'price':
            return this.priceParser.parse(value);
          default:
            return value;
        }
      }
    }

    return null;
  }
}
