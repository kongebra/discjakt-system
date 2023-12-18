import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '../../core/core.module';
import { QueueModule } from '../../queue/queue.module';
import { ScraperModule } from '../../scraper/scraper.module';
import { SitemapModule } from '../../sitemap/sitemap.module';
import { UtilsModule } from '../../utils/utils.module';
import { SitemapSchedulerService } from './sitemap-scheduler.service';

describe('SitemapSchedulerService', () => {
  let service: SitemapSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SitemapSchedulerService],
      imports: [
        CoreModule,
        UtilsModule,
        SitemapModule,
        ScraperModule,
        QueueModule,
      ],
    }).compile();

    service = module.get<SitemapSchedulerService>(SitemapSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
