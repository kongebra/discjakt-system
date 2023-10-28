export const SELECTORS = {
  PRODUCT: {
    NAME: ['h1', 'title'],
    DESCRIPTION: ['.description'],
    PRICE: [
      '.qs-product-price',
      '.product-price',
      '.products_price',
      '.m-product-price',
      '.price-item',
      '.price-item--regular',
      '.product .summary .price',
    ],
    IMAGE_URL: ['.product-information img', '.product-image img'],
  },
  METADATA: {
    PRODUCT: {
      NAME: ['meta[property="og:title"]'],
      DESCRIPTION: ['meta[property="og:description"]'],
      PRICE: [
        'meta[property="og:price:amount"]',
        'meta[property="product:price:amount"]',
        'meta[property="product:price:amount"]',
      ],
      IMAGE_URL: [
        'meta[property="og:image"]',
        'meta[property="og:image:secure_url"]',
      ],
    },
  },
} as const;
