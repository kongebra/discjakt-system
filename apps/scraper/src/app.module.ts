import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManufacturersController } from './manufacturers/manufacturers.controller';
import { PriceParserService } from './price-parser/price-parser.service';
import { PrismaService } from './prisma/prisma.service';
import { ProductsController } from './products/products.controller';
import { RetailersController } from './retailers/retailers.controller';
import { RetailersService } from './retailers/retailers.service';
import { RobotsTxtService } from './robots-txt/robots-txt.service';
import { ScraperController } from './scraper/scraper.controller';
import { ScraperService } from './scraper/scraper.service';
import { SitemapParserService } from './sitemap-parser/sitemap-parser.service';
import { SlugifyService } from './slugify/slugify.service';
import { TasksService } from './tasks/tasks.service';
import { TaskProcessor } from './tasks/task.processor';
import { QueueService } from './queue/queue.service';
import { QueueController } from './queue/queue.controller';
import { OpenTelemetryModule } from 'nestjs-otel';

@Module({
  imports: [
    OpenTelemetryModule.forRoot({
      metrics: {
        hostMetrics: true, // Includes Host Metrics
        apiMetrics: {
          enable: true, // Includes api metrics
          defaultAttributes: {
            // You can set default labels for api metrics
            custom: 'label',
          },
          ignoreRoutes: ['/favicon.ico'], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
          ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
        },
      },
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDISHOST,
        port: process.env.REDISPORT ? parseInt(process.env.REDISPORT) : 6379,
        username: process.env.REDISUSER,
        password: process.env.REDISPASSWORD,
      },
    }),
    BullModule.registerQueue({
      name: 'products',
      limiter: {
        max: 10,
        duration: 1000,
      },
    }),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  controllers: [
    AppController,
    ProductsController,
    ManufacturersController,
    ScraperController,
    RetailersController,
    QueueController,
  ],
  providers: [
    AppService,
    PrismaService,
    TasksService,
    ScraperService,
    PriceParserService,
    RobotsTxtService,
    SitemapParserService,
    RetailersService,
    SlugifyService,
    TaskProcessor,
    QueueService,
  ],
})
export class AppModule {}
