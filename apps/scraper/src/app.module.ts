import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManufacturersController } from './manufacturers/manufacturers.controller';
import { PrismaService } from './prisma/prisma.service';
import { ProductsController } from './products/products.controller';
import { ScraperController } from './scraper/scraper.controller';
import { ScraperService } from './scraper/scraper.service';
import { TasksService } from './tasks/tasks.service';
import { PriceParserService } from './price-parser/price-parser.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDISHOST,
        port: process.env.REDISPORT ? parseInt(process.env.REDISPORT) : 6379,
        username: process.env.REDISUSER,
        password: process.env.REDISPASSWORD,
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
  ],
  providers: [
    AppService,
    PrismaService,
    TasksService,
    ScraperService,
    PriceParserService,
  ],
})
export class AppModule {}
