import { Injectable, Logger } from '@nestjs/common';
import { CheerioAPI } from 'cheerio';
import { BaseScraperService } from '../base-scraper.service';
import { IScraper, IScraperConfig, ScrapeResult } from '../scraper.interface';

@Injectable()
export class DiscGolfDynastyService
  extends BaseScraperService
  implements IScraper
{
  private readonly logger = new Logger(DiscGolfDynastyService.name);

  readonly config: IScraperConfig = {
    name: 'disc-golf-dynasty',
    domain: 'discgolfdynasty.no',
    baseUrl: 'https://www.discgolfdynasty.no/',
    crawlDelay: 1,
    selectors: {
      name: 'h1.product__title',
      image: '.product-gallery__link img',
      inStock: 'button.product__add-to-cart-button',

      speed: '#ContentPlaceHolder1_lblSpeed',
      glide: '#ContentPlaceHolder1_lblGlide',
      turn: '#ContentPlaceHolder1_lblTurn',
      fade: '#ContentPlaceHolder1_lblFade',
    },
  };

  async scrape(url: string): Promise<ScrapeResult> {
    return this.tracer.startActiveSpan('aceshop.scrape', async (span) => {
      try {
        const [$, result] = await this.fetch(url);
        if ($ === null) {
          return result;
        }

        result.data.name = $(this.config.selectors.name).first().text().trim();
        result.data.brand = this.parseBrand($);
        [result.data.price, result.data.originalPrice] = this.parsePrice($);

        result.data.image = this.parseImage($);

        result.data.inStock =
          $(this.config.selectors.inStock)
            .first()
            .text()
            .trim()
            .toLocaleLowerCase() !== 'utsolgt';

        [
          result.data.speed,
          result.data.glide,
          result.data.turn,
          result.data.fade,
        ] = this.parseFlightNumber($);

        return result;
      } catch (err) {
        span.setAttributes({
          'error.type': err.name,
          'error.message': err.message,
          'error.stack': err.stack,
        });

        throw err;
      } finally {
        span.end();
      }
    });
  }

  parseImage($: CheerioAPI): string {
    let image = $(this.config.selectors.image).first().attr('src');

    if (image.startsWith('//')) {
      image = `https:${image}`;
    }

    return image;
  }

  parsePrice($: CheerioAPI): [number, number] {
    let price = 0,
      originalPrice = 0;

    const container = $('.price-container');
    const onSale = container.attr('data-sale').toLowerCase() === 'true';
    const priceContentStr = container
      .find('p.price-container__price > span')
      .attr('content')
      .replace('.', '')
      .trim();

    price = parseFloat(priceContentStr);
    price /= 100;

    if (onSale) {
      const originalPriceStr = container
        .find('span.product__compare-price')
        .text()
        .trim();
      originalPrice = this.priceParser.parse(originalPriceStr);
    } else {
      originalPrice = price;
    }

    return [price, originalPrice];
  }

  parseFlightNumber($: CheerioAPI): [number, number, number, number] {
    let speed = 0,
      glide = 0,
      turn = 0,
      fade = 0;

    let speedText = $(this.config.selectors.speed).text().trim();
    let glideText = $(this.config.selectors.glide).text().trim();
    let turnText = $(this.config.selectors.turn).text().trim();
    let fadeText = $(this.config.selectors.fade).text().trim();

    if (speedText) {
      speedText = speedText.replace('Speed: ', '').trim();
      speed = parseFloat(speedText);
    }

    if (glideText) {
      glideText = glideText.replace('Glide: ', '').trim();
      glide = parseFloat(glideText);
    }

    if (turnText) {
      turnText = turnText.replace('Turn: ', '').trim();
      turn = parseFloat(turnText);
    }

    if (fadeText) {
      fadeText = fadeText.replace('Fade: ', '').trim();
      fade = parseFloat(fadeText);
    }

    return [speed, glide, turn, fade];
  }

  parseBrand($: CheerioAPI): string {
    let result = '';

    $('.breadcrumbs a').each((i, el) => {
      const text = $(el).text().trim();
      const lowerCaseText = text.toLowerCase();
      const href = $(el).attr('href');

      if (lowerCaseText && href.includes(`/${lowerCaseText}`)) {
        result = text;
        return false;
      }
    });

    return result;
  }
}
