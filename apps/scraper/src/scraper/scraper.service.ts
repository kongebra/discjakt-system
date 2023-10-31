import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { CheerioAPI, load } from 'cheerio';
import { PriceParserService } from '../price-parser/price-parser.service';
import { SELECTORS } from './selectors';

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

      const html = response.data;
      const $ = load(html);

      result.title = this.extractValue(
        $,
        SELECTORS.METADATA.PRODUCT.NAME,
        SELECTORS.PRODUCT.NAME,
        'text',
        true,
      ) as string | null;

      result.description = this.extractValue(
        $,
        SELECTORS.METADATA.PRODUCT.DESCRIPTION,
        SELECTORS.PRODUCT.DESCRIPTION,
        'text',
        true,
      ) as string | null;

      result.price = this.extractValue(
        $,
        SELECTORS.METADATA.PRODUCT.PRICE,
        SELECTORS.PRODUCT.PRICE,
        'price',
        true,
      ) as number | null;

      result.image_url = this.extractValue(
        $,
        SELECTORS.METADATA.PRODUCT.IMAGE_URL,
        SELECTORS.PRODUCT.IMAGE_URL,
        'src',
        true,
      ) as string | null;

      return result;
    } catch (error) {
      return {
        title: null,
        description: null,
        price: null,
        image_url: null,

        status: error?.response?.status,
        statusText: error?.response?.statusText,
      } satisfies ScrapeResult;
    }
  }

  private extractValue(
    $: CheerioAPI,
    metadataSelectors: readonly string[],
    productSelectors: readonly string[],
    type: 'text' | 'price' | 'src',
    isMetadata: boolean = false,
  ): string | number | null {
    let value = this.extractFromSelectors(
      $,
      metadataSelectors,
      type,
      isMetadata,
    );

    if (!value) {
      value = this.extractFromSelectors($, productSelectors, type);
    }

    return value;
  }

  private extractFromSelectors(
    $: CheerioAPI,
    selectors: readonly string[],
    type: 'text' | 'price' | 'src',
    isMetadata: boolean = false,
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
            break;
          case 'src':
            value = $(selector).attr('src');
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
