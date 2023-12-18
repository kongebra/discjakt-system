import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ScrapeJob } from './queue.interface';
import Bull, { JobOptions, Queue } from 'bull';
import { TracerService } from '../core/tracer/tracer.service';

type QueueStatsDto = {
  total: Bull.JobCounts;
  queues: Record<string, Bull.JobCounts>;
};

@Injectable()
export class QueueService {
  private readonly queues: Map<string, Queue<ScrapeJob>>;

  constructor(
    private readonly tracer: TracerService,
    @InjectQueue('aceshop-queue')
    private readonly aceshop: Queue<ScrapeJob>,
  ) {
    this.queues = new Map<string, Queue<ScrapeJob>>();

    this.queues.set('aceshop', aceshop);
  }

  public async enqueueScrapeJob(data: ScrapeJob, options?: JobOptions) {
    return this.tracer.startActiveSpan(
      'QueueService.enqueueScrapeJob',
      async (span) => {
        try {
          const opts: JobOptions = {
            ...options,
            removeOnComplete: true,
            removeOnFail: false,
          };

          span.setAttributes({
            'queue.retailer.slug': data.retailerSlug,
            'queue.job.data.url': data.sitemapItem.loc,
            'queue.job.data.lastmod': data.sitemapItem.lastmod,
            'queue.job.data.changefreq': data.sitemapItem.changefreq,
            'queue.job.data.priority': data.sitemapItem.priority,
          });

          if (!this.queues.has(data.retailerSlug)) {
            throw new Error(
              `No queue found for retailer slug ${data.retailerSlug}`,
            );
          }

          this.queues.get(data.retailerSlug).add('scrape', data, opts);
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

  public async getStats(): Promise<QueueStatsDto> {
    const keys = Array.from(this.queues.keys());

    const result: QueueStatsDto = {
      total: {
        active: 0,
        completed: 0,
        failed: 0,
        delayed: 0,
        waiting: 0,
      },
      queues: {},
    };

    const stats = await Promise.all(
      keys.map(async (key) => {
        const queue = this.queues.get(key);

        const counts = await queue.getJobCounts();

        result.queues[key] = counts;

        return counts;
      }),
    );

    result.total = stats.reduce(
      (prev, curr) => {
        return {
          waiting: prev.waiting + curr.waiting,
          active: prev.active + curr.active,
          completed: prev.completed + curr.completed,
          failed: prev.failed + curr.failed,
          delayed: prev.delayed + curr.delayed,
        };
      },
      {
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        delayed: 0,
      },
    );

    return result;
  }

  public async empty(key: string) {
    const queue = this.queues.get(key);

    return queue.empty();
  }
}
