import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { CheerioAPI, load } from 'cheerio';
import { SELECTORS } from './selectors';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(private readonly http: HttpService) {}

  public async scrape(url: string): Promise<any> {
    const response = await this.http.axiosRef.get(url);

    if (response.status !== 200) {
      return {
        status: response.status,
        statusText: response.statusText,
      };
    }

    const html = response.data;
    const $ = load(html);

    const title = this.extractStringValueFromSelectors(
      $,
      SELECTORS.PRODUCT.NAME,
    );
    const description = this.extractStringValueFromSelectors(
      $,
      SELECTORS.PRODUCT.DESCRIPTION,
    );
    const price = this.extractPriceValueFromSelectors(
      $,
      SELECTORS.PRODUCT.PRICE,
    );
    const image_url = this.extractImageSrcValueFromSelectors(
      $,
      SELECTORS.PRODUCT.IMAGE_URL,
    );

    return {
      title,
      description,
      price,
      image_url,
    };
  }

  private extractStringValueFromSelectors(
    $: CheerioAPI,
    selectors: readonly string[],
  ): string | null {
    for (const selector of selectors) {
      const value = $(selector).text().trim();

      if (value) {
        return value;
      }
    }

    return null;
  }

  private extractPriceValueFromSelectors(
    $: CheerioAPI,
    selectors: readonly string[],
  ): string | null {
    const stringValue = this.extractStringValueFromSelectors($, selectors);
    if (stringValue) {
      // TODO: Convert to number, but we need to handle different currency symbols, and different decimal separators (dot or comma)
      return stringValue;
    }

    return null;
  }

  private extractImageSrcValueFromSelectors(
    $: CheerioAPI,
    selectors: readonly string[],
  ): string | null {
    for (const selector of selectors) {
      const value = $(selector).attr('src');

      if (value) {
        return value;
      }
    }

    return null;
  }
}
