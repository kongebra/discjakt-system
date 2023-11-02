import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Product, Retailer } from 'database';
import { QueueService } from 'src/queue/queue.service';
import { PrismaService } from '../prisma/prisma.service';
import { RobotsTxtService, UserAgent } from '../robots-txt/robots-txt.service';
import {
  SitemapItem,
  SitemapParserService,
} from '../sitemap-parser/sitemap-parser.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly robotsTxtService: RobotsTxtService,
    private readonly sitemapService: SitemapParserService,
    private readonly queueService: QueueService,
  ) {}

  public async work(retailer: Retailer) {
    this.logger.debug(`Starting cron for ${retailer.slug}`);

    const baseUrl = this.normalizeBaseUrl(retailer.website_url);
    const botRules = await this.parseRobotsTxt(baseUrl);
    const productItems = await this.fetchFilteredSitemapItems(
      baseUrl,
      retailer,
    );

    this.logger.debug(
      `Found ${productItems.length} products for ${retailer.slug}`,
    );

    if (productItems.length === 0) {
      this.logger.warn(`No products found for ${retailer.slug}`);
    }

    await this.updateRetailerTimestamp(retailer, productItems.length);
    await this.updateProductQueue(productItems, retailer, botRules);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    try {
      const retailers = await this.fetchRetailers();
      if (retailers.length === 0) {
        this.logger.debug(`No retailers to update`);
        return;
      }

      await Promise.all(retailers.map((retailer) => this.work(retailer)));
      // const retailer = await this.fetchRetailer();
      // if (!retailer) {
      //   this.logger.debug(`No retailers to update`);
      //   return;
      // }

      // await this.work(retailer);
    } catch (error) {
      this.logger.error(`Error in handleCron: ${error.message}`);
    }
  }

  private async fetchRetailers() {
    return this.prisma.retailer.findMany({});
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
      // Temp: Må finne ut hvordan vi håndterer denne her
      if (baseUrl.includes('https://discgolf-wheelie.no')) {
        return [];
      }

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

      await Promise.all(
        productItems.map((item) => {
          if (this.shouldSkipItemBasedOnBotRules(item, botRules)) {
            return null;
          }

          const existingProduct = productMap.get(item.loc);
          if (existingProduct) {
            return this.updateProduct(item, existingProduct, retailer);
          }

          return this.createProduct(item, retailer);
        }),
      );
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
    const skip = (botRules.disallow ?? []).some((disallow) =>
      item.loc.includes(disallow),
    );

    if (skip) {
      this.logger.debug(
        `Skipping ${item.loc} because it matches a disallowed path`,
        botRules,
      );
    }

    return skip;
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
        return await this.queueService.add(
          'update',
          item,
          retailer,
          `lastmod differs: ${foundLastmod} !== ${itemLastmod}`,
        );
      }

      // TODO: Move this to a nightly cron job
      // const sameDate = this.checkIfSameDate(
      //   new Date(existingProduct.updated_at),
      //   new Date(),
      // );
      // if (!sameDate) {
      //   return await this.queueService.add(
      //     'update',
      //     item,
      //     retailer,
      //     `updated_at is not same date: ${existingProduct.updated_at}`,
      //   );
      // }
    } catch (error) {
      this.logger.error(
        `Error updating product for retailer ${retailer.slug} and product ${item.loc}: ${error.message}`,
      );
    }
  }

  private checkIfSameDate(a: Date, b: Date): boolean {
    const [aYear, aMonth, aDay] = [a.getFullYear(), a.getMonth(), a.getDate()];
    const [bYear, bMonth, bDay] = [b.getFullYear(), b.getMonth(), b.getDate()];

    if (aYear === bYear && aMonth === bMonth && aDay === bDay) {
      return true;
    }

    return false;
  }

  private async createProduct(item: SitemapItem, retailer: Retailer) {
    try {
      return await this.queueService.add('create', item, retailer);
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

  private async updateRetailerTimestamp(
    retailer: Retailer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sitemapItemsCount: number,
  ): Promise<Retailer> {
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
    [
      'aceshop',
      (loc) => loc.includes('/products/') && !loc.includes('/se/products/'),
    ],
    ['frisbeebutikken', (loc) => loc.includes('/products/')],
    ['discsjappa', (loc) => loc.includes('/products/')],
    ['disc-golf-dynasty', (loc) => loc.includes('/products/')],
    ['krokholdgs', (loc) => loc.includes('/products/')],
    ['golfdiscer', (loc) => loc.includes('/products/')],
    ['sendeskive', (loc) => loc.includes('/products/')],
    ['discover-discs', (loc) => loc.includes('/products/')],
    ['disc-sor', (loc) => loc.includes('/products/')],
    ['disc-sr', (loc) => loc.includes('/products/')],
    ['kast-meg', (loc) => loc.includes('/products/')],
    ['prodisc', (loc) => loc.includes('/products/')],
    ['we-are-disc-golf', (loc) => loc.includes('/produkt/')],
    ['frisbee-sr', (loc) => loc.includes('/produkt/')],
    ['discshopen', (loc) => loc.includes('/produkt/')],
    ['dgshop', (_, priority) => priority === '1.0'],
    ['discgolf-wheelie', (loc) => loc.includes('/butikkkatalog/')],
    ['spinnvill-discgolf', (loc) => loc.includes('/product-page/')],
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
