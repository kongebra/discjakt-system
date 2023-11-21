import { Test, TestingModule } from '@nestjs/testing';
import { SitemapFilterService } from './sitemap-filter.service';

describe('SitemapFilterService', () => {
  let service: SitemapFilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SitemapFilterService],
    }).compile();

    service = module.get<SitemapFilterService>(SitemapFilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
