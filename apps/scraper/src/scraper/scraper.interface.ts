export interface IScraper {
  readonly config: IScraperConfig;

  scrape(url: string): Promise<ScrapeResult>;
}

export interface ProductSelectors {
  name: string;
  brand: string;
  category: string;
  price: string;
  originalPrice: string;
  inStock: string;
  quantity: string;
  image: string;
  speed: string;
  glide: string;
  turn: string;
  fade: string;
}

export interface IScraperConfig {
  name: string;
  domain: string;
  baseUrl: string;
  crawlDelay: number;

  selectors: Partial<ProductSelectors>;
}

export interface ScrapedProduct {
  name: string;
  image: string;
  url: string;
  inStock: boolean;
  quantity: number;
  retailerSlug: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  speed: number;
  glide: number;
  turn: number;
  fade: number;
}

export interface ScrapeResult {
  data: ScrapedProduct;

  meta: {
    url: string;
    retailerSlug: string;
    scraperName: string;
    scrapedAt: Date;
    httpStatus: number;
    httpStatusText: string;
  };
}
