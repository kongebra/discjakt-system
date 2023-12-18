import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Span } from '@opentelemetry/api';
import { PrismaService } from '../../core/prisma/prisma.service';
import { TracerService } from '../../core/tracer/tracer.service';
import { QUEUE_CONFIG } from '../../queue/queue.config';
import { QueueService } from '../../queue/queue.service';
import { SitemapService } from '../../sitemap/sitemap.service';
import { SitemapItem } from '../../sitemap/types';

type RetailerDto = {
  slug: string;
  name: string;
  website_url: string;
};

type ProductDto = {
  id: string;
  name: string;
  url: string;
  lastmod: string;
};

@Injectable()
export class SitemapSchedulerService {
  constructor(
    private readonly tracer: TracerService,
    private readonly prisma: PrismaService,
    private readonly sitemap: SitemapService,
    private readonly queue: QueueService,
  ) {}

  //   @Cron(CronExpression.EVERY_DAY_AT_3AM, {
  //     timeZone: 'Europe/Oslo',
  //   })
  //   async nightlyJob() {
  //     await this.tracer.startActiveSpan(
  //       'SitemapSchedulerService.nightlyJob',
  //       async (span) => {
  //         try {
  //           const retailers = await this.findAllRetailers();

  //           for (const retailer of retailers) {
  //             const sitemapUrl = this.buildSitemapUrl(retailer);
  //             const items = await this.sitemap.fetchAndFilter(
  //               retailer.slug,
  //               sitemapUrl.toString(),
  //             );

  //             try {
  //               await this.enqueueTasks(retailer, items);
  //             } catch (err) {
  //               this.handleError(span, err, {
  //                 'scheduler.retailer.slug': retailer.slug,
  //               });
  //               throw err;
  //             }
  //           }
  //         } catch (err) {
  //           this.handleError(span, err);
  //           throw err;
  //         } finally {
  //           span.end();
  //         }
  //       },
  //     );
  //   }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async enqueueUpdatedRetailerProducts() {
    await this.tracer.startActiveSpan(
      'SitemapSchedulerService.enqueueUpdatedRetailerProducts',
      async (span) => {
        try {
          const retailer = await this.findLatestUpdatedRetailer();
          if (!retailer) {
            this.logNoRetailerFound(span);
            return;
          }

          const products = await this.fetchProductsForRetailer(retailer);
          await this.updateRetailer(retailer.slug);
          this.logRetailerDetails(span, retailer);

          const sitemapUrl = this.buildSitemapUrl(retailer);
          const items = await this.sitemap.fetchAndFilter(
            retailer.slug,
            sitemapUrl.toString(),
          );
          this.logSitemapDetails(span, items);

          const tasks = this.prepareTasks(products, items);
          this.logTaskDetails(span, tasks);

          await this.enqueueTasks(retailer, tasks);
        } catch (err) {
          this.handleError(span, err);
          throw err;
        } finally {
          span.end();
        }
      },
    );
  }

  private handleError(span: Span, err: Error, context?: Record<string, any>) {
    const errorAttributes = {
      'scheduler.error': err.message,
      ...context,
    };

    span.setAttributes(errorAttributes);
  }

  private async enqueueTasks(
    retailer: RetailerDto,
    tasks: SitemapItem[],
  ): Promise<void> {
    // We can spam all to the queue, as each queue control their own crawl delay
    await Promise.all(
      tasks.map((item) =>
        this.queue.enqueueScrapeJob({
          retailerSlug: retailer.slug,
          sitemapItem: item,
        }),
      ),
    );
  }

  private logTaskDetails(span: Span, tasks: SitemapItem[]) {
    span.setAttributes({
      'scheduler.tasks.length': tasks.length,
    });
  }

  private prepareTasks(
    products: ProductDto[],
    items: SitemapItem[],
  ): SitemapItem[] {
    const productMap = new Map<string, ProductDto>();
    products.forEach((product) => {
      productMap.set(product.url, product);
    });

    return items.filter((item) => {
      const product = productMap.get(item.loc);

      return !product || product.lastmod !== item.lastmod;
    });
  }

  private logSitemapDetails(span: Span, items: SitemapItem[]) {
    span.setAttributes({
      'scheduler.sitemap.items': items.length,
    });
  }

  private buildSitemapUrl(retailer: RetailerDto): URL {
    return new URL('/sitemap.xml', retailer.website_url);
  }

  private logRetailerDetails(span: Span, retailer: RetailerDto) {
    span.setAttributes({
      'scheduler.retailer.name': retailer.name,
      'scheduler.retailer.slug': retailer.slug,
    });
  }

  private async fetchProductsForRetailer(
    retailer: RetailerDto,
  ): Promise<ProductDto[]> {
    return await this.prisma.product.findMany({
      where: {
        retailer: {
          slug: retailer.slug,
        },
      },
      select: {
        id: true,
        name: true,
        url: true,
        lastmod: true,
      },
    });
  }

  private logNoRetailerFound(span: Span) {
    span.setAttributes({
      'scheduler.retailer': 'none',
    });
  }

  private async findLatestUpdatedRetailer(): Promise<RetailerDto> {
    const slugs = QUEUE_CONFIG.map((config) => config.retailerSlug);

    return await this.prisma.retailer.findFirst({
      where: {
        slug: {
          in: slugs,
        },
      },
      select: {
        slug: true,
        name: true,
        website_url: true,
      },
      orderBy: {
        updated_at: 'asc',
      },
    });
  }

  private async findAllRetailers(): Promise<RetailerDto[]> {
    return await this.prisma.retailer.findMany({
      select: {
        slug: true,
        name: true,
        website_url: true,
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
}
