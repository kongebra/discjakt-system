import { Controller, Get, Param, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { TasksService } from 'src/tasks/tasks.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('scraper')
export class ScraperController {
  constructor(
    private readonly service: ScraperService,
    private readonly tasksService: TasksService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  public async scrape(@Query('url') url: string): Promise<any> {
    return await this.service.scrape(url);
  }

  @Get('retailer/:slug')
  public async scrapeRetailer(@Param('slug') slug: string): Promise<any> {
    const retailer = await this.prisma.retailer.findUnique({
      where: {
        slug,
      },
    });
    if (!retailer) {
      return {
        error: `Retailer ${slug} not found`,
      };
    }

    return await this.tasksService.work(retailer, true);
  }
}
