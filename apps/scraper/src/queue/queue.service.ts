import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { Retailer } from 'database';
import { SitemapItem } from 'src/sitemap-parser/sitemap-parser.service';

type JobMethod = 'create' | 'update';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('products') private readonly productsQueue: Queue,
  ) {}

  private async calculateDelay(item: SitemapItem, retailer: Retailer) {
    // Get the most recent job for this retailer
    const jobs = await this.productsQueue.getJobs([
      'waiting',
      'active',
      'delayed',
    ]);
    const retailerJobs = jobs.filter(
      (job) => job.data.retailer_slug === retailer.slug,
    );

    const mostRecentJob =
      retailerJobs.length > 0 ? retailerJobs[retailerJobs.length - 1] : null;

    // Calculate the delay based on the most recent job and the retailer's crawl delay
    let delay = (retailer?.crawl_delay || 0.5) * 1000; // Convert to milliseconds
    if (mostRecentJob) {
      const mostRecentJobTimestamp = mostRecentJob.timestamp;
      const now = Date.now();
      const timeUntilMostRecentJob =
        mostRecentJobTimestamp + mostRecentJob.opts.delay - now;
      delay =
        timeUntilMostRecentJob > 0 ? timeUntilMostRecentJob + delay : delay;
    }

    return delay;
  }

  public async add(
    method: JobMethod,
    item: SitemapItem,
    retailer: Retailer,
    reason?: string,
  ) {
    const delay = 0;

    // this.logger.debug(
    //   `Adding ${method} job for ${item.loc} with ${delay}ms delay`,
    // );

    // Add the new job to the queue with the calculated delay
    return await this.productsQueue.add(
      method,
      { ...item, retailer_slug: retailer.slug, reason },
      { removeOnComplete: true, removeOnFail: true, delay },
    );
  }
}
