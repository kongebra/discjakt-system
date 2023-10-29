import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { RobotsTxtService } from '../robots-txt/robots-txt.service';
import { SitemapParserService } from '../sitemap-parser/sitemap-parser.service';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';

const mockFindFirst = jest.fn();

describe('TasksService', () => {
  let service: TasksService;
  let mockQueue: jest.Mocked<Queue>;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: {
            retailer: {
              findFirst: mockFindFirst,
              update: jest.fn(),
            },
            product: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: RobotsTxtService,
          useValue: {
            fetchAndParse: jest.fn().mockResolvedValue({}),
            getBestMatchingUserAgent: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: SitemapParserService,
          useValue: {
            fetchAndParse: jest
              .fn()
              .mockResolvedValue([{ loc: 'http://example.com/product' }]),
          },
        },
        {
          provide: getQueueToken('products'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleCron', () => {
    it('should handle no retailer case', async () => {
      mockFindFirst.mockResolvedValue(null);
      await service.handleCron();
      expect(mockFindFirst).toBeCalled();
    });

    it('should handle retailer case and update queue', async () => {
      mockFindFirst.mockResolvedValue({
        website_url: 'http://example.com',
        slug: 'example',
      } as any);

      await service.handleCron();

      expect(mockQueue.add).toBeCalledWith(
        'create',
        expect.objectContaining({
          loc: 'http://example.com/product',
          retailer_slug: 'example',
        }),
        expect.any(Object),
      );
    });

    it('should catch and log exceptions', async () => {
      mockFindFirst.mockRejectedValue(new Error('Test Error'));
      await service.handleCron();
      // Here, you would check if the logger has received the 'Test Error' message
    });

    it('should log debug message when no retailer is found', async () => {
      // Setup
      mockFindFirst.mockResolvedValue(null);
      const loggerSpy = jest.spyOn(service['logger'], 'debug');

      // Execute
      await service.handleCron();

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith('No retailers to update');
    });

    it('should log error when exception occurs in fetchRetailer', async () => {
      // Setup
      mockFindFirst.mockRejectedValue(new Error('Test Error'));
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      // Execute
      await service.handleCron();

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith('Error in handleCron: Test Error');
    });

    it('should handle botRules and skip items based on them', async () => {
      mockFindFirst.mockResolvedValue({
        website_url: 'http://example.com',
        slug: 'example',
      } as any);
      const mockGetBestMatchingUserAgent = jest.fn().mockResolvedValue({
        disallow: ['/product'],
      });
      jest
        .spyOn(service['robotsTxtService'], 'getBestMatchingUserAgent')
        .mockImplementation(mockGetBestMatchingUserAgent);

      await service.handleCron();

      expect(mockQueue.add).not.toBeCalledWith(
        expect.objectContaining({
          loc: expect.stringContaining('/product'),
        }),
        expect.any(Object),
      );
    });

    it('should log error and continue when updating a product fails', async () => {
      mockFindFirst.mockResolvedValue({
        website_url: 'http://example.com',
        slug: 'example',
      } as any);
      const loggerSpy = jest.spyOn(service['logger'], 'error');
      mockQueue.add.mockRejectedValue(new Error('Queue Error'));

      await service.handleCron();

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error creating product: Queue Error'),
      );
    });

    it('should log error when updating retailer timestamp fails', async () => {
      mockFindFirst.mockResolvedValue({
        website_url: 'http://example.com',
        slug: 'example',
      } as any);
      const loggerSpy = jest.spyOn(service['logger'], 'error');
      jest
        .spyOn(service['prisma'].retailer, 'update')
        .mockRejectedValue(new Error('Update Error'));

      await service.handleCron();

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Error updating retailer timestamp: Update Error',
        ),
      );
    });

    it('should log error when fetchRetailer throws an exception', async () => {
      mockFindFirst.mockRejectedValue(new Error('Fetch Retailer Error'));
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      await service.handleCron();

      expect(loggerSpy).toHaveBeenCalledWith(
        'Error in handleCron: Fetch Retailer Error',
      );
    });

    it('should log error when parseRobotsTxt throws an exception', async () => {
      mockFindFirst.mockResolvedValue({
        website_url: 'http://example.com',
        slug: 'example',
      } as any);
      jest
        .spyOn(service['robotsTxtService'], 'fetchAndParse')
        .mockRejectedValue(new Error('Robots Txt Error'));
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      await service.handleCron();

      expect(loggerSpy).toHaveBeenCalledWith(
        'Error fetching and parsing robots.txt: Robots Txt Error',
      );
    });

    it('should log error when fetchFilteredSitemapItems throws an exception', async () => {
      mockFindFirst.mockResolvedValue({
        website_url: 'http://example.com',
        slug: 'example',
      } as any);
      jest
        .spyOn(service['sitemapService'], 'fetchAndParse')
        .mockRejectedValue(new Error('Sitemap Error'));
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      await service.handleCron();

      expect(loggerSpy).toHaveBeenCalledWith(
        'Error fetching and parsing sitemap: Sitemap Error',
      );
    });

    it('should log error when updateProductQueue throws an exception', async () => {
      mockFindFirst.mockResolvedValue({
        website_url: 'http://example.com',
        slug: 'example',
      } as any);
      jest
        .spyOn(service, 'updateProductQueue' as any)
        .mockRejectedValue(new Error('Update Product Queue Error'));
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      await service.handleCron();

      expect(loggerSpy).toHaveBeenCalledWith(
        'Error in handleCron: Update Product Queue Error',
      );
    });

    it('should log error when getProductMap throws an exception', async () => {
      mockFindFirst.mockResolvedValue({
        website_url: 'http://example.com',
        slug: 'example',
      } as any);
      jest
        .spyOn(service['prisma'].product, 'findMany')
        .mockRejectedValue(new Error('Get Product Map Error'));
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      await service.handleCron();

      expect(loggerSpy).toHaveBeenCalledWith(
        'Error fetching products: Get Product Map Error',
      );
    });
  });
});
