import { Controller, Delete, Get } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Controller('queue')
export class QueueController {
  constructor(@InjectQueue('products') private readonly productsQueue: Queue) {}

  @Delete('clear')
  async clearQueue() {
    await this.productsQueue.empty(); // This will empty the queue but keep the jobs in the 'completed' state
    await this.productsQueue.clean(0);
    await this.productsQueue.clean(0, 'failed');
    return { message: 'Queue cleared successfully' };
  }

  @Get('stats')
  async stats() {
    const [jobCounts] = await Promise.all([this.productsQueue.getJobCounts()]);

    return { jobCounts };
  }
}
