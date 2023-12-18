import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '../core/core.module';
import { QueueModule } from '../queue/queue.module';
import { ScraperModule } from '../scraper/scraper.module';
import { SitemapModule } from '../sitemap/sitemap.module';
import { UtilsModule } from '../utils/utils.module';
import { SchedulerController } from './scheduler.controller';
import { SitemapSchedulerService } from './sitemap-scheduler/sitemap-scheduler.service';

describe('SchedulerController', () => {
  let controller: SchedulerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulerController],
      providers: [SitemapSchedulerService],
      imports: [
        CoreModule,
        UtilsModule,
        SitemapModule,
        ScraperModule,
        QueueModule,
      ],
    }).compile();

    controller = module.get<SchedulerController>(SchedulerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
