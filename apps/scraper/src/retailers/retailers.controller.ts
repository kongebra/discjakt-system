import { Controller, Get } from '@nestjs/common';
import { RetailersService } from './retailers.service';

@Controller('retailers')
export class RetailersController {
  constructor(private readonly service: RetailersService) {}

  @Get()
  public async getRetailers() {
    return this.service.getRetailers();
  }

  @Get('/:slug')
  public async getRetailer(slug: string) {
    return this.service.getRetailer(slug);
  }
}
