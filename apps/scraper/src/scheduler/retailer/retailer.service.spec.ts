import { Test, TestingModule } from '@nestjs/testing';
import { RetailerService } from './retailer.service';
import { CoreModule } from '../../core/core.module';
import { UtilsModule } from '../../utils/utils.module';
import { SitemapModule } from '../../sitemap/sitemap.module';
import { ScraperModule } from '../../scraper/scraper.module';
import { QueueModule } from '../../queue/queue.module';

describe('RetailerService', () => {
  let service: RetailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetailerService],
      imports: [
        CoreModule,
        UtilsModule,
        SitemapModule,
        ScraperModule,
        QueueModule,
      ],
    }).compile();

    service = module.get<RetailerService>(RetailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
