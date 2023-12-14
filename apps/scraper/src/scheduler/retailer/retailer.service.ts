import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { Product } from 'database';
import { PrismaService } from '../../core/prisma/prisma.service';
import { TracerService } from '../../core/tracer/tracer.service';
import { ScraperService } from '../../scraper/scraper.service';
import { SitemapService } from '../../sitemap/sitemap.service';
import { SitemapItem } from '../../sitemap/types';
import { QueueService } from '../../queue/queue.service';
import { QUEUE_CONFIG } from 'src/queue/queue.config';

@Injectable()
export class RetailerService {
  private readonly logger = new Logger(RetailerService.name);

  constructor(
    private readonly tracer: TracerService,
    private readonly prisma: PrismaService,
    private readonly sitemap: SitemapService,
    private readonly scraper: ScraperService,
    private readonly queue: QueueService,
  ) {}

  // @Cron(CronExpression.EVERY_5_MINUTES)
  async frequentScrape() {
    this.tracer.startActiveSpan(
      'RetailerService.frequentScrape',
      async (span) => {
        try {
          // Fetch retailer, their products, and update the retailer's updated_at timestamp
          const retailer = await this.findLatestUpdatedRetailer();

          this.logger.debug(`Starting frequent scrape for ${retailer.slug}`);

          const products = await this.prisma.product.findMany({
            where: {
              retailer_slug: retailer.slug,
            },
          });
          await this.updateRetailer(retailer.slug);

          span.setAttributes({
            'scheduler.retailer.name': retailer.name,
            'scheduler.retailer.slug': retailer.slug,
          });

          // Fetch and filter sitemap items
          const sitemapUrl = new URL('/sitemap.xml', retailer.website_url);
          const items = await this.sitemap.fetchAndFilter(
            retailer.slug,
            sitemapUrl.toString(),
          );

          span.setAttributes({
            'scheduler.sitemap.items': items.length,
          });

          // Create a map of products for easier lookup
          const productMap = new Map<string, Product>();
          products.forEach((product) => {
            productMap.set(product.url, product);
          });

          // Store tasks for creating and updating products
          const tasks: SitemapItem[] = [];

          // Loop through sitemap items and compare with existing products
          for (const item of items) {
            const exists = productMap.get(item.loc);
            if (!exists) {
              tasks.push(item);
            } else {
              if (exists.lastmod !== item.lastmod) {
                tasks.push(item);
              }
            }
          }

          const scraperConfig = this.scraper.getConfig(retailer.slug);
          const crawlDelay = scraperConfig?.crawlDelay || 1; // in seconds

          this.logger.debug(`Found ${tasks.length} tasks for ${retailer.slug}`);

          for (const item of tasks) {
            this.queue.enqueueScrapeJob({
              crawlDelay,
              retailerSlug: retailer.slug,
              sitemapItem: item,
            });
          }

          span.setAttributes({
            'scheduler.tasks.length': tasks.length,
          });
        } catch (err) {
          span.setAttributes({
            'scheduler.error': err.message,
          });

          throw err;
        } finally {
          span.end();
        }
      },
    );
  }

  private async findLatestUpdatedRetailer() {
    const slugs = QUEUE_CONFIG.map((config) => config.retailerSlug);

    return await this.prisma.retailer.findFirst({
      where: {
        slug: {
          in: slugs,
        },
      },
      orderBy: {
        updated_at: 'asc',
      },
    });
  }

  private async updateRetailer(slug: string) {
    await this.prisma.retailer.update({
      where: {
        slug: slug,
      },
      data: {
        updated_at: new Date(),
      },
    });
  }

  private delay(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}
