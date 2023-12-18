import { SitemapItem } from '../sitemap/types';

export interface ScrapeJob {
  retailerSlug: string;
  crawlDelay?: number;

  sitemapItem: SitemapItem;
}
