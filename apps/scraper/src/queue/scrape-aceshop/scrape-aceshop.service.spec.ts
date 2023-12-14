import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeAceshopService } from './scrape-aceshop.service';
import { BullModule } from '@nestjs/bull';
import { CoreModule } from '../../core/core.module';
import { ScraperModule } from '../../scraper/scraper.module';
import { UtilsModule } from '../../utils/utils.module';

describe('ScrapeAceshopService', () => {
  let service: ScrapeAceshopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeAceshopService],
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

    service = module.get<ScrapeAceshopService>(ScrapeAceshopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
