import { Controller, Get, Param } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly service: QueueService) {}

  @Get('stats')
  async stats() {
    return await this.service.getStats();
  }

  @Get('empty/:key')
  async empty(@Param('key') key: string) {
    return await this.service.empty(key);
  }
}
