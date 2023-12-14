import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { CoreModule } from '../core/core.module';
import { UtilsModule } from '../utils/utils.module';
import { AceshopService } from './aceshop/aceshop.service';
import { FrisbeeSorService } from './frisbee-sor/frisbee-sor.service';
import { FrisbeebutikkenService } from './frisbeebutikken/frisbeebutikken.service';
import { GolfkongenService } from './golfkongen/golfkongen.service';
import { KrokholdgsService } from './krokholdgs/krokholdgs.service';
import { ProdiscService } from './prodisc/prodisc.service';
import { WeAreDiscGolfService } from './we-are-disc-golf/we-are-disc-golf.service';

describe('ScraperService', () => {
  let service: ScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
      imports: [CoreModule, UtilsModule],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
