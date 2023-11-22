import { Injectable } from '@nestjs/common';
import { AceshopService } from './aceshop/aceshop.service';
import { IScraper, IScraperConfig, ScrapeResult } from './scraper.interface';
import { FrisbeebutikkenService } from './frisbeebutikken/frisbeebutikken.service';
import { WeAreDiscGolfService } from './we-are-disc-golf/we-are-disc-golf.service';

@Injectable()
export class ScraperService {
  private readonly scrapers: Record<string, IScraper>;

  constructor(
    private readonly aceshop: AceshopService,
    private readonly frisbeebutikken: FrisbeebutikkenService,
    private readonly wearediscgolf: WeAreDiscGolfService,
  ) {
    this.scrapers = {
      aceshop: this.aceshop,
      frisbeebutikken: this.frisbeebutikken,
      'we-are-disc-golf': this.wearediscgolf,
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
