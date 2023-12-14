import { Test, TestingModule } from '@nestjs/testing';
import { BaseQueueScraperService } from './base-queue-scraper.service';
import { CoreModule } from '../../core/core.module';
import { UtilsModule } from '../../utils/utils.module';
import { ScraperModule } from '../../scraper/scraper.module';

describe('BaseQueueScraperService', () => {
  let service: BaseQueueScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseQueueScraperService],
      imports: [CoreModule, UtilsModule, ScraperModule],
    }).compile();

    service = module.get<BaseQueueScraperService>(BaseQueueScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
