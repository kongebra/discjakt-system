import { BullModule } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '../core/core.module';
import { ScraperModule } from '../scraper/scraper.module';
import { UtilsModule } from '../utils/utils.module';
import { QUEUE_CONFIG } from './queue.config';
import { QueueService } from './queue.service';

describe('QueueService', () => {
  let service: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueService],
      imports: [
        CoreModule,
        UtilsModule,
        ScraperModule,
        BullModule.forRoot({
          redis: {
            host: process.env.REDISHOST,
            port: process.env.REDISPORT
              ? parseInt(process.env.REDISPORT)
              : 6379,
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
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
