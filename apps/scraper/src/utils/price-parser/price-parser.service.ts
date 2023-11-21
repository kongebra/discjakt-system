import { Injectable } from '@nestjs/common';

@Injectable()
export class PriceParserService {
  public parse(price: string): number | null {
    // Known strings to remove
    const knownStrings = ['NOK', 'kr', ',-'];

    // Remove known strings and white-space
    let cleanedPrice = price;
    knownStrings.forEach((str) => {
      cleanedPrice = cleanedPrice.replace(new RegExp(str, 'g'), '');
    });
    cleanedPrice = cleanedPrice.replace(/\s/g, '');

    // Check for any remaining alphabetic characters
    if (/[a-zA-Z]/.test(cleanedPrice)) {
      return null;
    }

    // Identify decimal and thousands separators
    const hasDot = cleanedPrice.includes('.');
    const hasComma = cleanedPrice.includes(',');

    let sanitizedPrice = cleanedPrice;

    if (hasDot && hasComma) {
      if (cleanedPrice.indexOf('.') < cleanedPrice.indexOf(',')) {
        // Dot is the thousands separator
        sanitizedPrice = cleanedPrice.replace(/\./g, '').replace(',', '.');
      } else {
        // Comma is the thousands separator
        sanitizedPrice = cleanedPrice.replace(/,/g, '');
      }
    } else if (hasComma) {
      sanitizedPrice = cleanedPrice.replace(',', '.');
    }

    // Check if the sanitized string is a valid number
    if (!isNaN(Number(sanitizedPrice)) && sanitizedPrice !== '') {
      return Number(sanitizedPrice);
    }

    return null;
  }
}
