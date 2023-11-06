import { InjectQueue, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { trace } from '@opentelemetry/api';
import { Job, Queue } from 'bull';
import { Retailer } from 'database';
import { SitemapItem } from 'src/sitemap-parser/sitemap-parser.service';
import { PrismaService } from '../prisma/prisma.service';

const tracer = trace.getTracer('scraper_app');

export type JobData = {
  item: SitemapItem;
  retailer: Retailer;
  reason?: string;
};

@Injectable()
export class QueueService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('products') private readonly queue: Queue<JobData>,
  ) {}

  private async calculateDelay(retailer: Retailer): Promise<number> {
    return tracer.startActiveSpan('calculateDelay', async (span) => {
      // Get the count of pending jobs for this retailer.
      const pendingJobs = await this.queue.getJobs(['waiting', 'delayed']);
      const retailerJobCount = pendingJobs.filter(
        (job) => job.data.retailer.slug === retailer.slug,
      ).length;

      span.setAttributes({
        'job.retailer.slug': retailer.slug,
        'job.pendingJobs': pendingJobs.length,
        'job.retailer.jobCount': retailerJobCount,
      });

      // Calculate delay based on the retailer's crawl_delay.
      // If crawl_delay is not set, use a default value or 0.
      const delayPerJob = retailer.crawl_delay || 1;
      span.setAttribute('job.delayPerJob', delayPerJob);

      // Calculate total delay
      let totalDelay = retailerJobCount * delayPerJob;

      // Implement a maximum delay cap if necessary.
      const MAX_DELAY = 30000; // Maximum delay of 30 seconds as an example.
      totalDelay = Math.min(totalDelay, MAX_DELAY);

      span.setAttribute('job.totalDelay', totalDelay);

      return totalDelay;
    });
  }

  public async add(
    action: 'create' | 'update',
    item: SitemapItem,
    retailer: Retailer,
    reason?: string,
  ) {
    return tracer.startActiveSpan('add', async (span) => {
      // Logic to calculate delay
      const delay = await this.calculateDelay(retailer);

      span.setAttributes({
        'job.item.loc': item.loc,
        'job.retailer.slug': retailer.slug,
        'job.action': action,
        'job.delay': delay,
      });

      return await this.queue.add(
        action,
        {
          item,
          retailer,
          reason,
        },
        { delay, removeOnComplete: true, removeOnFail: true },
      );
    });
  }

  @OnQueueCompleted()
  onCompleted(job: Job<JobData>) {
    tracer.startActiveSpan('onCompleted', (span) => {
      const { item, retailer } = job.data;
      const { lastmod, priority, loc } = item;

      span.setAttributes({
        'job.item.loc': loc,
        'job.item.lastmod': lastmod,
        'job.item.priority': priority,
        'job.retailer.slug': retailer.slug,
      });

      span.end();
    });
  }

  @OnQueueFailed()
  onFailed(job: Job<JobData>, error: Error) {
    tracer.startActiveSpan('onFailed', (span) => {
      const { item, retailer } = job.data;
      const { lastmod, priority, loc } = item;

      span.setAttributes({
        'job.item.loc': loc,
        'job.item.lastmod': lastmod,
        'job.item.priority': priority,
        'job.retailer.slug': retailer.slug,
        'job.error': error.message,
      });

      span.end();
    });
  }
}
