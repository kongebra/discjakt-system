import { Module } from '@nestjs/common';
import { ScrapingController } from './scraping/scraping.controller';

@Module({
  controllers: [ScrapingController],
})
export class ApiModule {}
