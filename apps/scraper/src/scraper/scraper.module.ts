import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { UtilsModule } from '../utils/utils.module';
import { AceshopService } from './aceshop/aceshop.service';
import { ScraperService } from './scraper.service';
import { FrisbeebutikkenService } from './frisbeebutikken/frisbeebutikken.service';
import { ScraperController } from './scraper.controller';
import { WeAreDiscGolfService } from './we-are-disc-golf/we-are-disc-golf.service';
import { KrokholdgsService } from './krokholdgs/krokholdgs.service';
import { ProdiscService } from './prodisc/prodisc.service';
import { GolfkongenService } from './golfkongen/golfkongen.service';
import { FrisbeeSorService } from './frisbee-sor/frisbee-sor.service';
import { DiscGolfDynastyService } from './disc-golf-dynasty/disc-golf-dynasty.service';

@Module({
  imports: [CoreModule, UtilsModule],
  providers: [
    ScraperService,
    // Specific scrapers
    AceshopService,
    FrisbeebutikkenService,
    WeAreDiscGolfService,
    KrokholdgsService,
    ProdiscService,
    GolfkongenService,
    FrisbeeSorService,
    DiscGolfDynastyService,
  ],
  exports: [ScraperService],
  controllers: [ScraperController],
})
export class ScraperModule {}
