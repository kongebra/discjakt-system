import { BullModule } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '../../core/core.module';
import { ScraperModule } from '../../scraper/scraper.module';
import { UtilsModule } from '../../utils/utils.module';
import { AceshopQueueService } from './aceshop-queue.service';

describe('AceshopQueueService', () => {
  let service: AceshopQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AceshopQueueService],
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
      ],
    }).compile();

    service = module.get<AceshopQueueService>(AceshopQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
