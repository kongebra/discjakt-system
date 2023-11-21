import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { CoreModule } from './core/core.module';
import { DataModule } from './data/data.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScraperModule } from './scraper/scraper.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ApiModule,
    CoreModule,
    DataModule,
    SchedulerModule,
    ScraperModule,
    SitemapModule,
    UtilsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
