import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { ScraperService } from '../scraper/scraper.service';
import { SitemapItem } from '../sitemap-parser/sitemap-parser.service';

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

  @Process('create')
  async create(job: Job<ProductJob>) {
    const data = await this.scraper.scrape(job.data.loc);

    if (!data) {
      this.logger.error(`Error scraping ${job.data.loc}`);
      return {};
    }

    const product = await this.prisma.product.create({
      data: {
        name: data.title,
        description: data.description,
        url: job.data.loc,
        image_url: data.image_url,

        meta_title: data.title,
        meta_description: data.description,

        priority: job.data.priority,

        retailer: {
          connect: {
            slug: job.data.retailer_slug,
          },
        },

        price_history: {
          create: {
            current_price: data.price,
            original_price: data.price,
            in_stock: false, // TODO: We need to implement this in our scraper
            is_promotion: false, // TODO: We need to implement this in our scraper
          },
        },
      },
    });

    this.logger.debug(`Created product ${product.name}`);

    return {};
  }

  @Process('update')
  async update(job: Job<ProductJob>) {
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

        priority: job.data.priority,

        price_history: {
          create: {
            current_price: data.price,
            original_price: data.price,
            in_stock: false, // TODO: We need to implement this in our scraper
            is_promotion: false, // TODO: We need to implement this in our scraper
          },
        },
      },
    });

    this.logger.debug(
      `Updated product ${product.name} (Reason: ${job.data.reason || 'none'})`,
    );

    return {};
  }
}