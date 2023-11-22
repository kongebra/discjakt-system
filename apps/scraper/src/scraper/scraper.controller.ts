import { Controller, Get, Param, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraper: ScraperService) {}

  @Get('scrape/:retailerSlug')
  async scrape(
    @Param('retailerSlug') retailerSlug: string,
    @Query('url') url: string,
  ) {
    return await this.scraper.scrape(retailerSlug, url);
  }
}
