import { Test, TestingModule } from '@nestjs/testing';
import { SitemapParserService } from './sitemap-parser.service';

describe('SitemapParserService', () => {
  let service: SitemapParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SitemapParserService],
    }).compile();

    service = module.get<SitemapParserService>(SitemapParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
