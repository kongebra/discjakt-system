import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BaseQueueService } from '../base-queue/base-queue.service';
import { ScrapeJob } from '../queue.interface';

@Processor('aceshop-queue')
export class AceshopQueueService extends BaseQueueService {
  @Process('scrape')
  async handleScrapeJob(job: Job<ScrapeJob>) {
    return this.tracer.startActiveSpan(
      'ScrapeAceshopService.handleScrapeJob',
      async (span) => {
        try {
          await this.scrape('aceshop', job);
        } catch (err) {
          span.setAttributes({
            'scraper.error': err.message,
          });

          throw err;
        } finally {
          span.end();
        }
      },
    );
  }
}
