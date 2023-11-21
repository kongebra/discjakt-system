import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../core/prisma/prisma.service';
import { TracerService } from '../../core/tracer/tracer.service';
import { ScraperService } from '../../scraper/scraper.service';
import { SitemapService } from '../../sitemap/sitemap.service';
import { Product } from 'database';
import { SitemapItem } from 'src/sitemap/types';

@Injectable()
export class RetailerService {
  private readonly logger = new Logger(RetailerService.name);

  constructor(
    private readonly tracer: TracerService,
    private readonly prisma: PrismaService,
    private readonly sitemap: SitemapService,
    private readonly scraper: ScraperService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async frequentScrape() {
    this.tracer.startActiveSpan(
      'RetailerService.frequentScrape',
      async (span) => {
        try {
          // Fetch retailer, their products, and update the retailer's updated_at timestamp
          const retailer = await this.findLatestUpdatedRetailer();
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
          const createTasks: SitemapItem[] = [];
          const updateTasks: SitemapItem[] = [];

          // Loop through sitemap items and compare with existing products
          for (const item of items) {
            const exists = productMap.get(item.loc);
            if (!exists) {
              createTasks.push(item);
            } else {
              if (exists.lastmod !== item.lastmod) {
                updateTasks.push(item);
              }
            }
          }

          const scraperConfig = this.scraper.getConfig(retailer.slug);
          const crawlDelay = scraperConfig?.crawlDelay || 1; // in seconds

          for (const item of createTasks) {
            // TODO: Implement crawl delay
            const result = await this.scraper.scrape(retailer.slug, item.loc);

            this.prisma.product.create({
              data: {
                name: result.data.name,
                url: item.loc,
                image_url: result.data.image,
                brand: result.data.brand,
                meta_category: result.data.category,
                speed: result.data.speed,
                glide: result.data.glide,
                turn: result.data.turn,
                fade: result.data.fade,

                retailer_slug: retailer.slug,

                price_history: {
                  create: [
                    {
                      current_price: result.data.price,
                      original_price: result.data.originalPrice,
                      in_stock: result.data.inStock,
                      quantity: result.data.quantity,
                      is_promotion:
                        result.data.price < result.data.originalPrice,
                    },
                  ],
                },
              },
            });
          }

          span.setAttributes({
            'scheduler.createTasks.length': createTasks.length,
            'scheduler.updateTasks.length': updateTasks.length,
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
    return await this.prisma.retailer.findFirst({
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
}
