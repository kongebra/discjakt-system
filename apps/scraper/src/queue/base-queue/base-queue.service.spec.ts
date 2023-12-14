import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '../../core/core.module';
import { ScraperModule } from '../../scraper/scraper.module';
import { UtilsModule } from '../../utils/utils.module';
import { BaseQueueService } from './base-queue.service';

describe('BaseQueueService', () => {
  let service: BaseQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseQueueService],
      imports: [CoreModule, UtilsModule, ScraperModule],
    }).compile();

    service = module.get<BaseQueueService>(BaseQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
