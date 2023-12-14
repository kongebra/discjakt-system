import { Injectable } from '@nestjs/common';
import { Attributes } from '@opentelemetry/api';
import { Job } from 'bull';
import { PrismaService } from '../../core/prisma/prisma.service';
import { TracerService } from '../../core/tracer/tracer.service';
import { ScrapeResult } from '../../scraper/scraper.interface';
import { ScraperService } from '../../scraper/scraper.service';
import { ScrapeJob } from '../queue.interface';

@Injectable()
export class BaseQueueService {
  constructor(
    protected readonly tracer: TracerService,
    protected readonly scraper: ScraperService,
    protected readonly prisma: PrismaService,
  ) {}

  public async scrape(
    retailerSlug: string,
    job: Job<ScrapeJob>,
  ): Promise<ScrapeResult> {
    return this.tracer.startActiveSpan(
      `${retailerSlug}Queue.scrape`,
      async (span) => {
        span.setAttributes({
          'scraper.retailer.slug': retailerSlug,
          'scraper.url': job.data.sitemapItem.loc,
        });

        try {
          const result = await this.scraper.scrape(
            retailerSlug,
            job.data.sitemapItem.loc,
          );

          const attributes: Attributes = {};
          Object.keys(result.data).forEach((key) => {
            attributes[`scraper.result.data.${key}`] = result.data[key];
          });
          Object.keys(result.meta).forEach((key) => {
            attributes[`scraper.result.meta.${key}`] = result.meta[key];
          });

          span.setAttributes({
            ...attributes,
          });

          const product = await this.prisma.product.upsert({
            where: {
              url: job.data.sitemapItem.loc,
            },
            create: {
              url: job.data.sitemapItem.loc,

              name: result.data.name,
              brand: result.data.brand,
              meta_category: result.data.category,
              speed: result.data.speed,
              glide: result.data.glide,
              turn: result.data.turn,
              fade: result.data.fade,
              image_url: result.data.image,

              lastmod: job.data.sitemapItem.lastmod,
              priority: job.data.sitemapItem.priority,
              retailer_slug: retailerSlug,

              price_history: {
                create: {
                  current_price: result.data.price,
                  original_price: result.data.originalPrice,
                  in_stock: result.data.inStock,
                  quantity: result.data.quantity,
                  is_promotion: result.data.price < result.data.originalPrice,
                },
              },
            },
            update: {
              name: result.data.name,
              brand: result.data.brand,
              meta_category: result.data.category,
              speed: result.data.speed,
              glide: result.data.glide,
              turn: result.data.turn,
              fade: result.data.fade,
              image_url: result.data.image,

              lastmod: job.data.sitemapItem.lastmod,
              priority: job.data.sitemapItem.priority,

              price_history: {
                create: {
                  current_price: result.data.price,
                  original_price: result.data.originalPrice,
                  in_stock: result.data.inStock,
                  quantity: result.data.quantity,
                  is_promotion: result.data.price < result.data.originalPrice,
                },
              },
            },
          });

          const productAttributes: Attributes = {};
          Object.keys(product).forEach((key) => {
            productAttributes[`scraper.product.${key}`] = product[key];
          });

          span.setAttributes({
            ...productAttributes,
          });

          return result;
        } catch (err) {
          span.setAttributes({
            'scraper.error': err.message,
          });

          throw err;
        } finally {
          span.end();
        }
      },
    );
  }
}
