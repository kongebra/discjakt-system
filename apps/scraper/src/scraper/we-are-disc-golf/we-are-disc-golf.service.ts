import { Injectable } from '@nestjs/common';
import { CheerioAPI } from 'cheerio';
import { BaseScraperService } from '../base-scraper.service';
import { IScraper, IScraperConfig, ScrapeResult } from '../scraper.interface';

@Injectable()
export class WeAreDiscGolfService
  extends BaseScraperService
  implements IScraper
{
  config: IScraperConfig = {
    baseUrl: 'https://wearediscgolf.no',
    crawlDelay: 3,
    domain: 'wearediscgolf.no',
    name: 'we-are-disc-golf',
    selectors: {
      name: '.product_title.entry-title',
      category: '.posted_in a[rel="tag"]',
      image: '.woocommerce-product-gallery__image img',
      price: 'ins .woocommerce-Price-amount.amount',
      originalPrice: 'del .woocommerce-Price-amount.amount',
      quantity:
        '.alternative-picker .alternative-variations .product-alternative',
      speed:
        '.woocommerce-product-attributes-item--attribute_pa_speed .woocommerce-product-attributes-item__value',
      glide:
        '.woocommerce-product-attributes-item--attribute_pa_glide .woocommerce-product-attributes-item__value',
      turn: '.woocommerce-product-attributes-item--attribute_pa_turn .woocommerce-product-attributes-item__value',
      fade: '.woocommerce-product-attributes-item--attribute_pa_fade .woocommerce-product-attributes-item__value',
    },
  };

  public async scrape(url: string): Promise<ScrapeResult> {
    const [$, result] = await this.fetch(url);
    if ($ === null) {
      return result;
    }

    result.data.name = $(this.config.selectors.name).first().text().trim();
    // result.data.brand = $(this.config.selectors.brand).first().text().trim();
    result.data.category = $(this.config.selectors.category)
      .first()
      .text()
      .trim();
    result.data.image = $(this.config.selectors.image).first().attr('src');
    if (!result.data.image) {
      result.data.image = $(
        '.woocommerce-product-gallery__image--placeholder img',
      )
        .first()
        .attr('src');
    }

    [result.data.price, result.data.originalPrice] = this.parsePrice($);

    [result.data.inStock, result.data.quantity] = this.parseStock($);

    if (result.data.inStock === false && result.data.price > 0) {
      result.data.inStock = true;
    }

    result.data.speed =
      parseFloat($(this.config.selectors.speed).first().text().trim()) || 0;
    result.data.glide =
      parseFloat($(this.config.selectors.glide).first().text().trim()) || 0;
    result.data.turn =
      parseFloat($(this.config.selectors.turn).first().text().trim()) || 0;
    result.data.fade =
      parseFloat($(this.config.selectors.fade).first().text().trim()) || 0;

    return result;
  }

  private parsePrice($: CheerioAPI): [number, number] {
    let priceStr, originalPriceStr;

    // Check if the product is on sale (both originalPrice and price exist)
    if (
      $(this.config.selectors.originalPrice).length &&
      $(this.config.selectors.price).length
    ) {
      originalPriceStr = $(this.config.selectors.originalPrice)
        .first()
        .text()
        .trim();
      priceStr = $(this.config.selectors.price).first().text().trim();
    } else {
      // Product is not on sale, use the normal price element for both price and originalPrice
      priceStr = $('p.price .woocommerce-Price-amount.amount')
        .first()
        .text()
        .trim();
      originalPriceStr = priceStr;
    }

    // Assuming you have a method `priceParser.parse` that handles string to number conversion
    const price = priceStr ? this.priceParser.parse(priceStr) : 0;
    const originalPrice = originalPriceStr
      ? this.priceParser.parse(originalPriceStr)
      : price;

    return [price, originalPrice];
  }

  private parseStock($: CheerioAPI): [boolean, number] {
    const quantity = $(this.config.selectors.quantity).length;

    const outOfStockText = $('.stock.out-of-stock').text();

    if (outOfStockText.length > 0) {
      return [false, 0];
    }

    return [quantity > 0, quantity];
  }
}
