import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AnyNode, Cheerio, CheerioAPI, load } from 'cheerio';
import { SitemapItem } from './types';
import { TracerService } from '../core/tracer/tracer.service';
import { SitemapFilterService } from './sitemap-filter/sitemap-filter.service';

@Injectable()
export class SitemapService {
  constructor(
    private readonly http: HttpService,
    private readonly tracer: TracerService,
    private readonly filterService: SitemapFilterService,
  ) {}

  public filter(retailerSlug: string, items: SitemapItem[]): SitemapItem[] {
    return this.filterService.filter(retailerSlug, items);
  }

  public async fetchAndFilter(
    retailerSlug: string,
    url: string,
  ): Promise<SitemapItem[]> {
    const items = await this.fetch(url);
    return this.filter(retailerSlug, items);
  }

  public async fetch(url: string): Promise<SitemapItem[]> {
    return this.tracer.startActiveSpan('SitemapService.fetch', async (span) => {
      try {
        const response = await this.http.axiosRef.get(url, {
          headers: {
            'User-Agent': 'DiscjaktBot',
          },
        });

        span.setAttributes({
          'sitemap.http.status': response.status,
          'sitemap.http.statusText': response.statusText,
        });

        if (response.status !== 200) {
          throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
        }

        const xml = response.data;
        const $ = this.loadXml(xml);

        const rootElement = $('urlset, sitemapindex');

        if (rootElement.length === 0) {
          throw new Error('Invalid XML: Root element not found');
        }

        if (rootElement.is('sitemapindex')) {
          return await this.parseSitemapIndexAsync($, rootElement);
        }

        if (rootElement.is('urlset')) {
          return this.parseSitemapUrlset($, rootElement);
        }

        return [];
      } catch (err) {
        span.setAttributes({
          'sitemap.error.message': err.message || 'Unknown error',
          'sitemap.error.url': url,
        });

        throw err;
      } finally {
        span.end();
      }
    });
  }

  private async parseSitemapIndexAsync(
    $: CheerioAPI,
    sitemapIndexElement: Cheerio<AnyNode>,
  ): Promise<SitemapItem[]> {
    return this.tracer.startActiveSpan(
      'SitemapService.parseSitemapIndexAsync',
      async (span) => {
        try {
          const sitemapElements = sitemapIndexElement.find('sitemap');
          const taskQueue = [];

          for (const sitemapElement of sitemapElements.toArray()) {
            const $sitemap = $(sitemapElement);
            const sitemapUrl = $sitemap.find('loc').text();

            taskQueue.push(() => this.fetchAndParseSitemap(sitemapUrl));
          }

          const MAX_CONCURRENT_REQUESTS = 5;
          const results = await this.processQueue(
            taskQueue,
            MAX_CONCURRENT_REQUESTS,
          );
          const mergedResults: SitemapItem[] = results.flat();

          span.setAttributes({
            'sitemap.items.count': mergedResults.length,
          });

          return mergedResults;
        } catch (err) {
          span.setAttributes({
            'sitemap.error.message': err.message || 'Unknown error',
          });

          throw err;
        } finally {
          span.end();
        }
      },
    );
  }

  private async fetchAndParseSitemap(
    sitemapUrl: string,
  ): Promise<SitemapItem[]> {
    return this.tracer.startActiveSpan(
      'SitemapService.fetchAndParseSitemap',
      async (span) => {
        try {
          const response = await this.http.axiosRef.get(sitemapUrl, {
            headers: { 'User-Agent': 'DiscjaktBot' },
          });

          span.setAttributes({
            'sitemap.http.status': response.status,
            'sitemap.http.statusText': response.statusText,
          });

          const xml = response.data;
          const $ = this.loadXml(xml);
          const rootElement = $('urlset');
          const result = this.parseSitemapUrlset($, rootElement);

          return result;
        } catch (error) {
          span.setAttributes({
            'sitemap.error.message': error.message,
            'sitemap.url': sitemapUrl,
          });

          return [];
        } finally {
          span.end();
        }
      },
    );
  }

  private parseSitemapUrlset(
    $: CheerioAPI,
    rootElement: Cheerio<AnyNode>,
  ): SitemapItem[] {
    return this.tracer.startActiveSpan(
      'SitemapService.parseSitemapUrlset',
      (span) => {
        try {
          const result: SitemapItem[] = [];
          const urlElements = rootElement.find('url');

          for (const urlElement of urlElements.toArray()) {
            const $url = $(urlElement);

            const loc = $url.find('loc').text();
            const lastmod = $url.find('lastmod').text() || '';
            const priority = $url.find('priority').text() || '';
            const changefreq = $url.find('changefreq').text() || '';

            result.push({
              loc,
              lastmod,
              priority,
              changefreq,
            });
          }

          return result;
        } catch (err) {
          span.setAttributes({
            'sitemap.error.message': err.message || 'Unknown error',
          });

          throw err;
        } finally {
          span.end();
        }
      },
    );
  }

  private loadXml(xml: string): CheerioAPI {
    return load(xml, { xml: true });
  }

  private async processQueue(
    tasks: (() => Promise<SitemapItem[]>)[],
    maxConcurrent: number,
  ): Promise<SitemapItem[][]> {
    let activeTasks = [];
    const results = [];

    for (const task of tasks) {
      if (activeTasks.length >= maxConcurrent) {
        const result = await Promise.race(activeTasks);
        results.push(result);
        activeTasks = activeTasks.filter((t) => t !== result);
      }

      const taskPromise = task().then((res) => {
        activeTasks = activeTasks.filter((t) => t !== taskPromise);
        return res;
      });

      activeTasks.push(taskPromise);
    }

    return Promise.all([...activeTasks, ...results]);
  }
}
