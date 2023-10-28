export const SELECTORS = {
  PRODUCT: {
    NAME: ['h1', 'title'],
    DESCRIPTION: ['meta[name="description"]', '.description'],
    PRICE: ['.product-price', '.products_price'],
    IMAGE_URL: ['.product-information img'],
  },
  METADATA: {
    PRODUCT: {
      NAME: ['meta[property="og:title"]'],
      DESCRIPTION: ['meta[property="og:description"]'],
      PRICE: [
        'meta[property="product:price:amount"]',
        'meta[property="product:price:amount"',
      ],
      IMAGE_URL: [
        'meta[property="og:image"]',
        'meta[property="og:image:secure_url"]',
      ],
    },
  },
} as const;
