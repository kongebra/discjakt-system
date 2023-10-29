import { Controller, Delete } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Controller('queue')
export class QueueController {
  constructor(@InjectQueue('products') private readonly productsQueue: Queue) {}

  @Delete('clear')
  async clearQueue() {
    await this.productsQueue.empty(); // This will empty the queue but keep the jobs in the 'completed' state
    await this.productsQueue.clean(0); // This will remove all jobs from the 'completed' state
    return { message: 'Queue cleared successfully' };
  }
}
