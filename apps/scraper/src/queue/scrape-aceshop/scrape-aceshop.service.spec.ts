import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeAceshopService } from './scrape-aceshop.service';

describe('ScrapeAceshopService', () => {
  let service: ScrapeAceshopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapeAceshopService],
    }).compile();

    service = module.get<ScrapeAceshopService>(ScrapeAceshopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
