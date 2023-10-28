import { Injectable } from '@nestjs/common';

@Injectable()
export class SlugifyService {
  public slugify(text: string): string {
    if (!text) {
      throw new Error('Invalid text provided for slugification');
    }

    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }
}
