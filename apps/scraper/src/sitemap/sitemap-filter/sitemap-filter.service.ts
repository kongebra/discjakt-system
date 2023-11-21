import { Injectable } from '@nestjs/common';
import { SitemapItem } from '../types';

@Injectable()
export class SitemapFilterService {
  constructor() {}

  public filter(retailerSlug: string, items: SitemapItem[]): SitemapItem[] {
    switch (retailerSlug) {
      case 'aceshop':
        return items.filter((item) => {
          return item.loc.includes('aceshop.no/products/');
        });

      default:
        return items;
    }
  }
}
