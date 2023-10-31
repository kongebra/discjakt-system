import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AnyNode, Cheerio, CheerioAPI, load } from 'cheerio';

export type SitemapItem = {
  loc: string;
  lastmod: string;
  priority: string;
};

@Injectable()
export class SitemapParserService {
  private readonly logger = new Logger(SitemapParserService.name);

  constructor(private readonly http: HttpService) {}

  public async parse(xml: string, url: string): Promise<SitemapItem[]> {
    const $ = load(xml, { xmlMode: true });

    const rootElement = $('urlset, sitemapindex');

    if (rootElement.is('sitemapindex')) {
      return await this.parseSitemapIndexAsync($, rootElement, url);
    }

    if (rootElement.is('urlset')) {
      return this.parseSitemapUrlset($, rootElement);
    }

    return [];
  }

  public async fetchAndParse(baseUrl: string): Promise<SitemapItem[]> {
    try {
      const normalizedBaseUrl = this.normalizeBaseUrl(baseUrl);
      const xml = await this.fetchXml(`${normalizedBaseUrl}/sitemap.xml`);
      return this.parse(xml, normalizedBaseUrl);
    } catch (error) {
      this.logger.error(
        `Failed to fetch and parse sitemap (${baseUrl}): ${error.message}`,
      );
      return [];
    }
  }

  private async fetchXml(url: string): Promise<string> {
    const response = await this.http.axiosRef.get(url, {
      headers: {
        'User-Agent': 'DiscjaktBot',
      },
    });

    return response.data;
  }

  private async parseSitemapIndexAsync(
    $: CheerioAPI,
    sitemapIndexElement: Cheerio<AnyNode>,
    baseUrl: string,
  ): Promise<SitemapItem[]> {
    const sitemapElements = sitemapIndexElement.find('sitemap');
    const fetchPromises: Promise<SitemapItem[]>[] = [];

    for (const sitemapElement of sitemapElements.toArray()) {
      const $sitemap = $(sitemapElement);
      const sitemapUrl = $sitemap.find('loc').text();
      const normalizedSitemapUrl = this.normalizeSitemapUrl(
        baseUrl,
        sitemapUrl,
      );

      const fetchPromise = this.fetchAndParseSitemap(normalizedSitemapUrl);
      fetchPromises.push(fetchPromise);
    }

    const results = await Promise.all(fetchPromises);
    const mergedResults: SitemapItem[] = results.flat();

    return mergedResults;
  }

  private async fetchAndParseSitemap(
    sitemapUrl: string,
  ): Promise<SitemapItem[]> {
    try {
      const response = await this.http.axiosRef.get(sitemapUrl);

      const xml = response.data;
      const $ = load(xml, { xmlMode: true });
      const rootElement = $('urlset');
      const result = this.parseSitemapUrlset($, rootElement);

      return result;
    } catch (error) {
      return [];
    }
  }

  private parseSitemapUrlset(
    $: CheerioAPI,
    rootElement: Cheerio<AnyNode>,
  ): SitemapItem[] {
    const result: SitemapItem[] = [];
    const urlElements = rootElement.find('url');

    for (const urlElement of urlElements.toArray()) {
      const $url = $(urlElement);
      const loc = $url.find('loc').text();
      const lastmod = $url.find('lastmod').text() || '';
      const priority = $url.find('priority').text() || '';

      result.push({
        loc,
        lastmod,
        priority,
      });
    }

    return result;
  }

  private normalizeBaseUrl(baseUrl: string): string {
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  private normalizeSitemapUrl(baseUrl: string, sitemapUrl: string): string {
    return sitemapUrl.startsWith('/') ? `${baseUrl}${sitemapUrl}` : sitemapUrl;
  }
}
