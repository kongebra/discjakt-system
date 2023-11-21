import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { UtilsModule } from '../utils/utils.module';
import { AceshopService } from './aceshop/aceshop.service';
import { ScraperService } from './scraper.service';

@Module({
  imports: [CoreModule, UtilsModule],
  providers: [AceshopService, ScraperService],
  exports: [ScraperService],
})
export class ScraperModule {}
