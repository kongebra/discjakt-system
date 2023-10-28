import { Test, TestingModule } from '@nestjs/testing';
import { SitemapParserService } from './sitemap-parser.service';
import { HttpModule } from '@nestjs/axios';

describe('SitemapParserService', () => {
  let service: SitemapParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [SitemapParserService],
    }).compile();

    service = module.get<SitemapParserService>(SitemapParserService);
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Fetching and Parsing', () => {
    it('should fetch and parse sitemap.xml', async () => {
      const data = await service.fetchAndParse('https://aceshop.no');
      expect(data.length).toBeGreaterThan(0);
    });

    it('should fetch and parse sitemap.xml with sitemapindex', async () => {
      const data = await service.fetchAndParse('https://wearediscgolf.no');
      expect(data.length).toBeGreaterThan(0);
    });

    it('should fail and return empty array if sitemap.xml does not exist', async () => {
      const data = await service.fetchAndParse(
        'https://www.google.com/this-should-not-work',
      );
      expect(data.length).toEqual(0);
    });
  });
});
