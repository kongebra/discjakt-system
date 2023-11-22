type QueueConfig = {
  retailerSlug: string;
  crawlDelay: number;
};

export const QUEUE_CONFIG: QueueConfig[] = [
  {
    retailerSlug: 'aceshop',
    crawlDelay: 5,
  },
];
