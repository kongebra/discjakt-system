import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CoreModule } from 'src/core/core.module';
import { UtilsModule } from 'src/utils/utils.module';
import { RetailerService } from './retailer/retailer.service';
import { ScraperModule } from 'src/scraper/scraper.module';
import { SitemapModule } from 'src/sitemap/sitemap.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CoreModule,
    UtilsModule,
    SitemapModule,
    ScraperModule,
  ],
  providers: [RetailerService],
})
export class SchedulerModule {}
