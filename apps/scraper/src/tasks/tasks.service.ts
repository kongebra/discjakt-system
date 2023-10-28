import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RobotsTxtService } from '../robots-txt/robots-txt.service';
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

  private normalizeBaseUrl(baseUrl: string): string {
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const retailer = await this.prisma.retailer.findFirst({
      orderBy: {
        updated_at: 'asc',
      },
    });

    if (!retailer) {
      this.logger.debug(`No retailers to update`);
      return;
    }

    const baseUrl = this.normalizeBaseUrl(retailer.website_url);

    const robotsTxt = await this.robotsTxtService.fetchAndParse(
      `${baseUrl}/robots.txt`,
    );
    const botRules = this.robotsTxtService.getBestMatchingUserAgent(
      robotsTxt,
      'DiscjaktBot',
    );

    const sitemapItems = await this.sitemapService.fetchAndParse(baseUrl);
    this.logger.debug(`Found ${sitemapItems.length} sitemap items`);

    const productItems = sitemapItems.filter((item) => {
      return this.sitemapItemFilter(item, retailer);
    });
    this.logger.debug(`Found ${productItems.length} product items`);

    // TODO: Add products on queue
    const productMap = new Map<string, Product>();
    const products = await this.prisma.product.findMany({
      where: {
        retailer_slug: retailer.slug,
      },
    });

    for (const product of products) {
      productMap.set(product.url, product);
    }

    for (const item of productItems) {
      if (
        botRules &&
        botRules.disallow.some((disallow) => item.loc.includes(disallow)) // TODO: Improve this
      ) {
        continue;
      }

      const found = productMap.get(item.loc);
      if (found) {
        const foundLastmod = new Date(found.lastmod).getTime();
        const itemLastmod = new Date(item.lastmod).getTime();

        if (foundLastmod !== itemLastmod) {
          await this.productsQueue.add(
            'update',
            {
              ...item,
              retailer_slug: retailer.slug,
            },
            {
              removeOnComplete: true,
            },
          );
        }
      } else {
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
      }
    }

    this.logger.debug(`Updating retailer '${retailer.slug}'`);
    await this.prisma.retailer.update({
      where: {
        slug: retailer.slug,
      },
      data: {
        updated_at: new Date(),
      },
    });
  }

  private sitemapItemFilter(
    { loc, priority }: SitemapItem,
    { slug, website_url }: Retailer,
  ): boolean {
    if (new URL(loc).toString() === new URL(website_url).toString()) {
      return false;
    }

    switch (slug) {
      case 'aceshop':
      case 'frisbeebutikken':
      case 'discsjappa':
      case 'disc-golf-dynasty':
      case 'krokholdgs':
      case 'golfdiscer':
      case 'sendeskive':
      case 'discover-discs':
      case 'discsjappa':
      case 'disc-sor':
      case 'kastmeg':
        return loc.includes('/products/');
      case 'prodisc':
      case 'wearediscgolf':
      case 'firsbeesor':
      case 'discshopen':
        return loc.includes('/produkt/');
      case 'dgshop':
        return priority === '1.0';
      case 'discgolf-wheelie':
        return loc.includes('/butikkkatalog/');
      case 'spinnvilldg':
        return loc.includes('/product-page/');
      case 'golfkongen':
        return loc.includes('/discgolf/') && priority === '0.5';
      default:
        return true;
    }
  }
}
