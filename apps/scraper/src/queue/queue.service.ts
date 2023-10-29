import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { Retailer } from 'database';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('products') private readonly productsQueue: Queue,
  ) {}

  async addJob(item: any, retailer: Retailer) {
    // Get the most recent job for this retailer
    const jobs = await this.productsQueue.getJobs([
      'waiting',
      'active',
      'delayed',
    ]);
    const retailerJobs = jobs.filter(
      (job) => job.data.retailer_slug === retailer.slug,
    );
    if (retailerJobs.length === 0) {
      return;
    }

    const mostRecentJob = retailerJobs[retailerJobs.length - 1];

    // Calculate the delay based on the most recent job and the retailer's crawl delay
    let delay = retailer.crawl_delay * 1000; // Convert to milliseconds
    if (mostRecentJob) {
      const mostRecentJobTimestamp = mostRecentJob.timestamp;
      const now = Date.now();
      const timeUntilMostRecentJob =
        mostRecentJobTimestamp + mostRecentJob.opts.delay - now;
      delay =
        timeUntilMostRecentJob > 0 ? timeUntilMostRecentJob + delay : delay;
    }

    this.logger.debug(`Adding job for ${item.loc} with delay ${delay}`);
    // Add the new job to the queue with the calculated delay
    await this.productsQueue.add(
      'create',
      { ...item, retailer_slug: retailer.slug },
      { removeOnComplete: true, delay },
    );
  }
}
