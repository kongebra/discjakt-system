import { Test, TestingModule } from '@nestjs/testing';
import { BaseQueueScraperService } from './base-queue-scraper.service';

describe('BaseQueueScraperService', () => {
  let service: BaseQueueScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseQueueScraperService],
    }).compile();

    service = module.get<BaseQueueScraperService>(BaseQueueScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
