import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { UtilsModule } from '../utils/utils.module';
import { SitemapService } from './sitemap.service';
import { SitemapFilterService } from './sitemap-filter/sitemap-filter.service';

@Module({
  imports: [CoreModule, UtilsModule],
  providers: [SitemapService, SitemapFilterService],
  exports: [SitemapService],
})
export class SitemapModule {}
