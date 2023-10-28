import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { ScraperService } from '../scraper/scraper.service';
import { SitemapItem } from '../sitemap-parser/sitemap-parser.service';

export type ProductJob = SitemapItem & {
  retailer_slug: string;
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

    this.logger.debug(`Creating product ${data.title}`);

    return {};
  }

  @Process('update')
  async update(job: Job<ProductJob>) {
    const product = await this.prisma.product.findUnique({
      where: {
        url: job.data.loc,
      },
    });

    this.logger.debug(`Updating product ${product.id}`);

    return {};
  }
}
