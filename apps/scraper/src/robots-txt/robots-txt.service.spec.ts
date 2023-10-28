import { Test, TestingModule } from '@nestjs/testing';
import { RobotsTxtService } from './robots-txt.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('RobotsTxtService', () => {
  let service: RobotsTxtService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [RobotsTxtService],
    }).compile();

    service = module.get<RobotsTxtService>(RobotsTxtService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Fetching robots.txt', () => {
    it('should return null if robots.txt does not exist', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of({ status: 404 } as any));
      const result = await service.fetchAndParse(
        'https://www.google.com/robots.txtxxxx',
      );
      expect(result).toBeNull();
    });
  });

  describe('Parsing robots.txt', () => {
    it('should return empty userAgents if content is empty', () => {
      const result = service.parse(``);
      expect(result.userAgents).toEqual([]);
    });

    it('should parse * user-agent', () => {
      const input = `User-agent: *`;
      const result = service.parse(input);
      expect(result.userAgents.length).toEqual(1);
      expect(result.userAgents[0].name).toEqual('*');
    });

    it('should parse allow and disallow rules', () => {
      const input = `User-agent: *
Allow: /
Disallow: /admin`;
      const result = service.parse(input);
      expect(result.userAgents.length).toEqual(1);
      expect(result.userAgents[0].allow).toEqual(['/']);
      expect(result.userAgents[0].disallow).toEqual(['/admin']);
    });

    it('should parse crawl-delay and sitemap rules', () => {
      const input = `User-agent: *
Allow: /
Disallow: /admin
Crawl-delay: 5
Sitemap: https://example.com/sitemap.xml`;
      const result = service.parse(input);
      expect(result.userAgents.length).toEqual(1);
      expect(result.userAgents[0].crawlDelay).toEqual(5);
      expect(result.userAgents[0].sitemap).toEqual(
        'https://example.com/sitemap.xml',
      );
    });
  });
});
