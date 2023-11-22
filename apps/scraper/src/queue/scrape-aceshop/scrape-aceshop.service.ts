import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BaseQueueScraperService } from '../base-queue-scraper/base-queue-scraper.service';
import { ScrapeJob } from '../queue.interface';

@Processor('scrape-aceshop')
export class ScrapeAceshopService extends BaseQueueScraperService {
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
