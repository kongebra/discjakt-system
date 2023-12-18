import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { SitemapSchedulerService } from './sitemap-scheduler/sitemap-scheduler.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(
    private readonly sitemapScheduler: SitemapSchedulerService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('start')
  async start() {
    await this.sitemapScheduler.enqueueUpdatedRetailerProducts();
  }

  @Get('debug')
  async debug() {
    const products = await this.prisma.product.findMany({
      where: {
        retailer_slug: 'aceshop',
      },

      orderBy: {
        updated_at: 'desc',
      },
    });

    return {
      length: products.length,
      data: products,
    };
  }
}
