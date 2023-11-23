import { Injectable } from '@nestjs/common';
import { AceshopService } from './aceshop/aceshop.service';
import { IScraper, IScraperConfig, ScrapeResult } from './scraper.interface';
import { FrisbeebutikkenService } from './frisbeebutikken/frisbeebutikken.service';
import { WeAreDiscGolfService } from './we-are-disc-golf/we-are-disc-golf.service';
import { KrokholdgsService } from './krokholdgs/krokholdgs.service';
import { ProdiscService } from './prodisc/prodisc.service';
import { GolfkongenService } from './golfkongen/golfkongen.service';
import { FrisbeeSorService } from './frisbee-sor/frisbee-sor.service';

@Injectable()
export class ScraperService {
  private readonly scrapers: Record<string, IScraper>;

  constructor(
    private readonly aceshop: AceshopService,
    private readonly frisbeebutikken: FrisbeebutikkenService,
    private readonly wearediscgolf: WeAreDiscGolfService,
    private readonly krokholdgs: KrokholdgsService,
    private readonly prodisc: ProdiscService,
    private readonly golfkongen: GolfkongenService,
    private readonly frisbeeSor: FrisbeeSorService,
  ) {
    this.scrapers = {
      [this.aceshop.config.name]: this.aceshop,
      [this.frisbeebutikken.config.name]: this.frisbeebutikken,
      [this.wearediscgolf.config.name]: this.wearediscgolf,
      [this.krokholdgs.config.name]: this.krokholdgs,
      [this.prodisc.config.name]: this.prodisc,
      [this.golfkongen.config.name]: this.golfkongen,
      [this.frisbeeSor.config.name]: this.frisbeeSor,
    };
  }

  public async scrape(
    retailerSlug: string,
    url: string,
  ): Promise<ScrapeResult> {
    const scraper = this.scrapers[retailerSlug];
    if (!scraper) {
      throw new Error(`No scraper found for retailer slug ${retailerSlug}`);
    }

    return await scraper.scrape(url);
  }

  public getConfig(retailerSlug: string): IScraperConfig | null {
    const scraper = this.scrapers[retailerSlug];
    if (!scraper) {
      return null;
    }

    return scraper.config;
  }
}
