import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ScrapeJob } from './queue.interface';
import { JobOptions, Queue } from 'bull';
import { TracerService } from '../core/tracer/tracer.service';

@Injectable()
export class QueueService {
  private readonly scraperQueues: Record<string, Queue<ScrapeJob>>;

  constructor(
    private readonly tracer: TracerService,
    @InjectQueue('aceshop-queue')
    private readonly aceshop: Queue<ScrapeJob>,
  ) {
    this.scraperQueues = {
      aceshop,
    };
  }

  public async enqueueScrapeJob(data: ScrapeJob, options?: JobOptions) {
    return this.tracer.startActiveSpan(
      'QueueService.enqueueScrapeJob',
      async (span) => {
        try {
          const resolvedOptions: JobOptions = {
            ...options,
            delay: await this.calculateDelay(data),
            removeOnComplete: true,
            removeOnFail: false,
          };

          span.setAttributes({
            'queue.retailer.slug': data.retailerSlug,
            'queue.job.delay': resolvedOptions.delay,
            'queue.job.data.url': data.sitemapItem.loc,
            'queue.job.data.lastmod': data.sitemapItem.lastmod,
            'queue.job.data.changefreq': data.sitemapItem.changefreq,
            'queue.job.data.priority': data.sitemapItem.priority,
          });

          const queue = this.scraperQueues[data.retailerSlug];
          if (!queue) {
            throw new Error(
              `No queue found for retailer slug ${data.retailerSlug}`,
            );
          }

          queue.add('scrape', data, resolvedOptions);
        } catch (err) {
          span.setAttributes({
            'queue.error': err.message,
          });

          throw err;
        } finally {
          span.end();
        }
      },
    );
  }

  private async calculateDelay({
    retailerSlug,
    crawlDelay,
  }: ScrapeJob): Promise<number> {
    return this.tracer.startActiveSpan(
      'QueueService.calculateDelay',
      async (span) => {
        try {
          const queue = this.scraperQueues[retailerSlug];
          if (!queue) {
            throw new Error(`No queue found for retailer slug ${retailerSlug}`);
          }

          const pendingJobs = await queue.getJobs([
            'waiting',
            'delayed',
            'active',
          ]);
          const jobCount = pendingJobs.length;

          const delay = jobCount * crawlDelay;

          span.setAttributes({
            'queue.retailer.slug': retailerSlug,
            'queue.job.count': jobCount,
            'queue.job.delay': delay,
          });

          return delay;
        } catch (err) {
          span.setAttributes({
            'queue.error': err.message,
          });

          throw err;
        } finally {
          span.end();
        }
      },
    );
  }
}
