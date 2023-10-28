import { Controller, Get, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly service: ScraperService) {}

  @Get()
  public async scrape(@Query('url') url: string): Promise<any> {
    return await this.service.scrape(url);
  }
}
