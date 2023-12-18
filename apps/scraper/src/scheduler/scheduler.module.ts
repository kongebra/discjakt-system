import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CoreModule } from '../core/core.module';
import { QueueModule } from '../queue/queue.module';
import { ScraperModule } from '../scraper/scraper.module';
import { SitemapModule } from '../sitemap/sitemap.module';
import { UtilsModule } from '../utils/utils.module';
import { SchedulerController } from './scheduler.controller';
import { SitemapSchedulerService } from './sitemap-scheduler/sitemap-scheduler.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CoreModule,
    UtilsModule,
    SitemapModule,
    ScraperModule,
    QueueModule,
  ],
  providers: [SitemapSchedulerService],
  controllers: [SchedulerController],
})
export class SchedulerModule {}
