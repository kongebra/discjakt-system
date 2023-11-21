import { Module } from '@nestjs/common';
import { SlugifyService } from './slugify/slugify.service';
import { PriceParserService } from './price-parser/price-parser.service';

@Module({
  providers: [SlugifyService, PriceParserService],
  exports: [SlugifyService, PriceParserService],
})
export class UtilsModule {}
