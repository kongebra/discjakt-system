import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RobotsTxtService, UserAgent } from '../robots-txt/robots-txt.service';
import {
  SitemapItem,
  SitemapParserService,
} from '../sitemap-parser/sitemap-parser.service';
import { Product, Retailer } from 'database';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly robotsTxtService: RobotsTxtService,
    private readonly sitemapService: SitemapParserService,
    @InjectQueue('products') private productsQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    try {
      const retailer = await this.fetchRetailer();
      if (!retailer) {
        this.logger.debug(`No retailers to update`);
        return;
      }

      this.logger.debug(`Starting cron for ${retailer.slug}`);

      const baseUrl = this.normalizeBaseUrl(retailer.website_url);
      const botRules = await this.parseRobotsTxt(baseUrl);
      const productItems = await this.fetchFilteredSitemapItems(
        baseUrl,
        retailer,
      );

      await this.updateProductQueue(productItems, retailer, botRules);
      await this.updateRetailerTimestamp(retailer);
    } catch (error) {
      this.logger.error(`Error in handleCron: ${error.message}`);
    }
  }

  private async fetchRetailer(): Promise<Retailer | null> {
    try {
      return this.prisma.retailer.findFirst({
        orderBy: {
          updated_at: 'asc',
        },
      });
    } catch (error) {
      this.logger.error(`Error fetching retailer: ${error.message}`);
      return null;
    }
  }

  private async parseRobotsTxt(baseUrl: string): Promise<UserAgent | null> {
    try {
      const robotsTxt = await this.robotsTxtService.fetchAndParse(
        `${baseUrl}/robots.txt`,
      );
      return this.robotsTxtService.getBestMatchingUserAgent(
        robotsTxt,
        'DiscjaktBot',
      );
    } catch (error) {
      this.logger.error(
        `Error fetching and parsing robots.txt: ${error.message}`,
      );
      return null;
    }
  }

  private async fetchFilteredSitemapItems(
    baseUrl: string,
    retailer: Retailer,
  ): Promise<SitemapItem[]> {
    try {
      const sitemapItems = await this.sitemapService.fetchAndParse(baseUrl);
      return sitemapItems.filter((item) =>
        this.sitemapItemFilter(item, retailer),
      );
    } catch (error) {
      this.logger.error(`Error fetching and parsing sitemap: ${error.message}`);
      return [];
    }
  }

  private async updateProductQueue(
    productItems: SitemapItem[],
    retailer: Retailer,
    botRules: UserAgent | null,
  ) {
    try {
      const productMap = await this.getProductMap(retailer);

      for (const item of productItems) {
        if (this.shouldSkipItemBasedOnBotRules(item, botRules)) {
          continue;
        }

        const existingProduct = productMap.get(item.loc);
        if (existingProduct) {
          await this.updateProduct(item, existingProduct, retailer);
        } else {
          await this.createProduct(item, retailer);
        }
      }
    } catch (error) {
      this.logger.error(`Error updating product queue: ${error.message}`);
    }
  }

  private shouldSkipItemBasedOnBotRules(
    item: SitemapItem,
    botRules: UserAgent | null,
  ): boolean {
    // Early exit if botRules is null
    if (!botRules) {
      return false;
    }

    // Check if any disallowed paths are part of the item's location
    return (botRules.disallow ?? []).some((disallow) =>
      item.loc.includes(disallow),
    );
  }

  private async updateProduct(
    item: SitemapItem,
    existingProduct: Product,
    retailer: Retailer,
  ) {
    try {
      const foundLastmod = new Date(existingProduct.lastmod).getTime();
      const itemLastmod = new Date(item.lastmod).getTime();

      if (foundLastmod !== itemLastmod) {
        await this.productsQueue.add(
          'update',
          {
            ...item,
            retailer_slug: retailer.slug,
            reason: `lastmod differs: ${foundLastmod} !== ${itemLastmod}, new vs old`,
          },
          {
            removeOnComplete: true,
          },
        );
      } else {
        this.logger.debug(
          `Skipped update on ${item.loc} because lastmod is the same`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error updating product for retailer ${retailer.slug} and product ${item.loc}: ${error.message}`,
      );
    }
  }

  private async createProduct(item: SitemapItem, retailer: Retailer) {
    try {
      await this.productsQueue.add(
        'create',
        {
          ...item,
          retailer_slug: retailer.slug,
        },
        {
          removeOnComplete: true,
        },
      );
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`);
    }
  }

  private async getProductMap(
    retailer: Retailer,
  ): Promise<Map<string, Product>> {
    try {
      const productMap = new Map<string, Product>();
      const products = await this.prisma.product.findMany({
        where: {
          retailer_slug: retailer.slug,
        },
      });

      for (const product of products) {
        productMap.set(product.url, product);
      }

      return productMap;
    } catch (error) {
      this.logger.error(`Error fetching products: ${error.message}`);
      return new Map<string, Product>();
    }
  }

  private async updateRetailerTimestamp(retailer: Retailer): Promise<Retailer> {
    try {
      return await this.prisma.retailer.update({
        where: { slug: retailer.slug },
        data: { updated_at: new Date() },
      });
    } catch (error) {
      this.logger.error(`Error updating retailer timestamp: ${error.message}`);
      return retailer;
    }
  }

  private readonly retailerRules = new Map<
    string,
    (loc: string, priority: string) => boolean
  >([
    ['aceshop', (loc) => loc.includes('/products/')],
    ['frisbeebutikken', (loc) => loc.includes('/products/')],
    ['discsjappa', (loc) => loc.includes('/products/')],
    ['disc-golf-dynasty', (loc) => loc.includes('/products/')],
    ['krokholdgs', (loc) => loc.includes('/products/')],
    ['golfdiscer', (loc) => loc.includes('/products/')],
    ['sendeskive', (loc) => loc.includes('/products/')],
    ['discover-discs', (loc) => loc.includes('/products/')],
    ['disc-sor', (loc) => loc.includes('/products/')],
    ['kastmeg', (loc) => loc.includes('/products/')],
    ['prodisc', (loc) => loc.includes('/produkt/')],
    ['wearediscgolf', (loc) => loc.includes('/produkt/')],
    ['firsbeesor', (loc) => loc.includes('/produkt/')],
    ['discshopen', (loc) => loc.includes('/produkt/')],
    ['dgshop', (_, priority) => priority === '1.0'],
    ['discgolf-wheelie', (loc) => loc.includes('/butikkkatalog/')],
    ['spinnvilldg', (loc) => loc.includes('/product-page/')],
    [
      'golfkongen',
      (loc, priority) => loc.includes('/discgolf/') && priority === '0.5',
    ],
  ]);

  private sitemapItemFilter(
    { loc, priority }: SitemapItem,
    { slug, website_url }: Retailer,
  ): boolean {
    if (new URL(loc).toString() === new URL(website_url).toString()) {
      return false;
    }

    const rule = this.retailerRules.get(slug);
    return rule ? rule(loc, priority) : true;
  }

  private normalizeBaseUrl(baseUrl: string): string {
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }
}
