import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScraperModule } from './scraper/scraper.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { UtilsModule } from './utils/utils.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    CoreModule,
    SchedulerModule,
    ScraperModule,
    SitemapModule,
    UtilsModule,
    QueueModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
