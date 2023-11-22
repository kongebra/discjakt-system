import { Controller, Get } from '@nestjs/common';
import { RetailerService } from './retailer/retailer.service';
import { PrismaService } from '../core/prisma/prisma.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(
    private readonly retailer: RetailerService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('start')
  async start() {
    await this.retailer.frequentScrape();
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

    return products;
  }
}
