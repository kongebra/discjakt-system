import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { ScraperService } from '../scraper/scraper.service';
import { SitemapItem } from '../sitemap-parser/sitemap-parser.service';
import { Span, trace } from '@opentelemetry/api';

const tracer = trace.getTracer('scraper_app');

export type ProductJob = SitemapItem & {
  retailer_slug: string;
  reason?: string;
};

@Processor('products')
export class TaskProcessor {
  private readonly logger = new Logger(TaskProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly scraper: ScraperService,
  ) {}

  @Process({
    name: 'create',
    concurrency: 4,
  })
  async create(job: Job<ProductJob>) {
    return tracer.startActiveSpan('create_product', async (span: Span) => {
      span.setAttributes({
        'product.url': job.data.loc,
        'product.retailer_slug': job.data.retailer_slug,
        'product.reason': job.data.reason || 'none',
        'product.lastmod': job.data.lastmod,
        'product.priority': job.data.priority,
      });

      try {
        const data = await this.scraper.scrape(job.data.loc);

        if (!data) {
          this.logger.error(`Error scraping ${job.data.loc}`);

          return {};
        }

        if (data.status === 404) {
          this.logger.warn(`Product not found ${job.data.loc}`);

          return {};
        }

        if (!data.title) {
          this.logger.warn(`No title found for ${job.data.loc}`);

          return {};
        }

        span.setAttributes({
          'product.name': data.title,
          'product.description': data.description,
          'product.image_url': data.image_url,
          'product.price': data.price || 0,
        });

        await this.prisma.product.create({
          data: {
            name: data.title,
            description: data.description,
            url: job.data.loc,
            image_url: data.image_url,

            meta_title: data.title,
            meta_description: data.description,

            lastmod: job.data.lastmod,
            priority: job.data.priority,

            retailer: {
              connect: {
                slug: job.data.retailer_slug,
              },
            },

            price_history: {
              create: {
                current_price: data.price || 0,
                original_price: data.price || 0,
                in_stock: false, // TODO: We need to implement this in our scraper
                is_promotion: false, // TODO: We need to implement this in our scraper
              },
            },
          },
        });

        return {};
      } catch (error) {
        this.logger.error(`Error creating product: ${error.message}`);

        if (
          error.message.includes(
            'Unique constraint failed on the fields: (`url`)',
          )
        ) {
          this.logger.error(`Product already exists ${job.data.loc}`);
        }
      } finally {
        span.end();
      }
    });
  }

  @Process({
    name: 'update',
    concurrency: 2,
  })
  async update(job: Job<ProductJob>) {
    tracer.startActiveSpan('update_product', async (span: Span) => {
      span.setAttributes({
        'product.url': job.data.loc,
        'product.retailer_slug': job.data.retailer_slug,
        'product.reason': job.data.reason || 'none',
        'product.lastmod': job.data.lastmod,
        'product.priority': job.data.priority,
      });

      try {
        const product = await this.prisma.product.findUnique({
          where: {
            url: job.data.loc,
          },
          include: {
            price_history: {
              orderBy: {
                created_at: 'desc',
              },
              take: 1,
            },
          },
        });

        if (!product) {
          this.logger.error(`Product not found ${job.data.loc}`);

          return {};
        }

        const data = await this.scraper.scrape(job.data.loc);

        if (!data) {
          this.logger.error(`Error scraping ${job.data.loc}`);

          return {};
        }

        if (data.status === 404) {
          this.logger.warn(`Product not found ${job.data.loc}`);
          await this.prisma.product.update({
            where: {
              url: job.data.loc,
            },
            data: {
              lastmod: job.data.lastmod,
              priority: job.data.priority,
            },
          });

          return {};
        }

        span.setAttributes({
          'product.name': data.title,
          'product.description': data.description,
          'product.image_url': data.image_url,
          'product.price': data.price || 0,
        });

        await this.prisma.product.update({
          where: {
            url: job.data.loc,
          },
          data: {
            name: data.title,
            description: data.description,
            image_url: data.image_url,

            meta_title: data.title,
            meta_description: data.description,

            lastmod: job.data.lastmod,
            priority: job.data.priority,

            price_history: {
              create: {
                current_price: data.price || 0,
                original_price: data.price || 0,
                in_stock: false, // TODO: We need to implement this in our scraper
                is_promotion: false, // TODO: We need to implement this in our scraper
              },
            },
          },
        });

        return {};
      } catch (error) {
        this.logger.error(`Error updating product: ${error.message}`);

        return {};
      } finally {
        span.end();
      }
    });
  }
}
