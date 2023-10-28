import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { PriceParserService } from '../price-parser/price-parser.service';
import { PrismaService } from '../prisma/prisma.service';
import { RetailersService } from '../retailers/retailers.service';
import { RobotsTxtService } from '../robots-txt/robots-txt.service';
import { ScraperService } from '../scraper/scraper.service';
import { SitemapParserService } from '../sitemap-parser/sitemap-parser.service';
import { SlugifyService } from '../slugify/slugify.service';
import { TaskProcessor } from './task.processor';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let module: TestingModule;
  // let queue: Queue;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        TasksService,
        RetailersService,
        PrismaService,
        RobotsTxtService,
        SitemapParserService,
        SlugifyService,
        ScraperService,
        PriceParserService,
        TaskProcessor,
      ],
      imports: [
        HttpModule,
        BullModule.forRoot({
          redis: {
            host: process.env.REDISHOST,
            port: process.env.REDISPORT
              ? parseInt(process.env.REDISPORT)
              : 6379,
            username: process.env.REDISUSER,
            password: process.env.REDISPASSWORD,
          },
        }),
        BullModule.registerQueue({
          name: 'products',
        }),
        ScheduleModule.forRoot(),
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
