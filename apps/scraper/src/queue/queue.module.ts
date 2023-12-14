import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { ScraperModule } from '../scraper/scraper.module';
import { UtilsModule } from '../utils/utils.module';
import { AceshopQueueService } from './aceshop-queue/aceshop-queue.service';
import { BaseQueueService } from './base-queue/base-queue.service';
import { QUEUE_CONFIG } from './queue.config';
import { QueueService } from './queue.service';

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
        name: `${config.retailerSlug}-queue`,
        limiter: {
          max: 1,
          duration: config.crawlDelay * 1000,
        },
      })),
    ),
  ],
  providers: [QueueService, BaseQueueService, AceshopQueueService],
  exports: [QueueService],
})
export class QueueModule {}
