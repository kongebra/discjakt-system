import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { ScraperModule } from '../scraper/scraper.module';
import { UtilsModule } from '../utils/utils.module';
import { BaseQueueScraperService } from './base-queue-scraper/base-queue-scraper.service';
import { QUEUE_CONFIG } from './queue.config';
import { QueueService } from './queue.service';
import { ScrapeAceshopService } from './scrape-aceshop/scrape-aceshop.service';

if (!process.env.REDISHOST) {
  throw new Error('Missing REDISHOST environment variable');
}

if (!process.env.REDISUSER) {
  throw new Error('Missing REDISUSER environment variable');
}

if (!process.env.REDISPASSWORD) {
  throw new Error('Missing REDISPASSWORD environment variable');
}

@Module({
  imports: [
    CoreModule,
    UtilsModule,
    ScraperModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDISHOST,
        port: process.env.REDISPORT ? parseInt(process.env.REDISPORT) : 6379,
        username: process.env.REDISUSER,
        password: process.env.REDISPASSWORD,
      },
    }),
    BullModule.registerQueue(
      ...QUEUE_CONFIG.map((config) => ({
        name: `scrape-${config.retailerSlug}`,
        limiter: {
          max: 1,
          duration: config.crawlDelay * 1000,
        },
      })),
    ),
  ],
  providers: [ScrapeAceshopService, QueueService, BaseQueueScraperService],
  exports: [QueueService],
})
export class QueueModule {}
