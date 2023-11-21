import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '../core/core.module';
import { UtilsModule } from '../utils/utils.module';
import { SitemapService } from './sitemap.service';
import { HttpService } from '@nestjs/axios';

jest.doMock('@nestjs/axios', () => ({
  HttpService: {
    axiosRef: {
      get: jest.fn(),
    },
  },
}));

describe('SitemapService', () => {
  let sitemapService: SitemapService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, UtilsModule],
      providers: [SitemapService],
    }).compile();

    sitemapService = module.get<SitemapService>(SitemapService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(sitemapService).toBeDefined();
  });

  it('should fetch and parse a sitemap successfully', async () => {
    jest.spyOn(httpService.axiosRef, 'get').mockImplementationOnce(() =>
      Promise.resolve({
        data: `<urlset><url><loc>http://example.com/page</loc></url></urlset>`,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      }),
    );

    const result = await sitemapService.fetch('http://example.com/sitemap.xml');

    expect(result).toEqual([
      {
        loc: 'http://example.com/page',
        lastmod: '',
        priority: '',
        changefreq: '',
      },
    ]);
  });

  it('should correctly parse sitemapindex structures', async () => {
    jest
      .spyOn(httpService.axiosRef, 'get')
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: `<sitemapindex>
               <sitemap><loc>http://example.com/sitemap1.xml</loc></sitemap>
               <sitemap><loc>http://example.com/sitemap2.xml</loc></sitemap>
             </sitemapindex>`,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: `<urlset><url><loc>http://example.com/page1</loc></url></urlset>`,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: `<urlset><url><loc>http://example.com/page2</loc></url></urlset>`,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        }),
      );

    const result = await sitemapService.fetch('http://example.com/sitemap.xml');

    expect(result).toEqual([
      {
        loc: 'http://example.com/page1',
        lastmod: '',
        priority: '',
        changefreq: '',
      },
      {
        loc: 'http://example.com/page2',
        lastmod: '',
        priority: '',
        changefreq: '',
      },
    ]);
  });

  it('should handle HTTP errors appropriately', async () => {
    jest
      .spyOn(httpService.axiosRef, 'get')
      .mockRejectedValue(new Error('HTTP Error'));

    await expect(
      sitemapService.fetch('http://example.com/sitemap.xml'),
    ).rejects.toThrow('HTTP Error');
  });

  it('should handle XML parsing errors', async () => {
    jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue({
      data: 'invalid XML',
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    await expect(
      sitemapService.fetch('http://example.com/sitemap.xml'),
    ).rejects.toThrow();
  });
});
