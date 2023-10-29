import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RetailerCreateDto, RetailersService } from './retailers.service';

@Controller('retailers')
export class RetailersController {
  constructor(private readonly service: RetailersService) {}

  @Get()
  public async getRetailers() {
    return await this.service.getRetailers();
  }

  @Get(':slug')
  public async getRetailer(@Param('slug') slug: string) {
    const retailer = await this.service.getRetailer(slug);

    if (!retailer) {
      throw new NotFoundException('retailer not found', {
        cause: new Error(),
        description: `retailer with slug '${slug}' doesn't exist`,
      });
    }

    return retailer;
  }

  @Post()
  public async createRetailer(@Body() data: RetailerCreateDto) {
    const retailer = await this.service.createRetailer(data);

    return retailer;
  }

  @Put(':slug')
  public async updateRetailer(
    @Param('slug') slug: string,
    @Body() data: RetailerCreateDto,
  ) {
    const retailer = await this.service.updateRetailer(slug, data);

    if (!retailer) {
      throw new NotFoundException('retailer not found', {
        cause: new Error(),
        description: `retailer with slug '${slug}' doesn't exist`,
      });
    }

    return retailer;
  }

  @Put(':slug/robots-txt')
  public async updateRetailerRobotsTxt(@Param('slug') slug: string) {
    const retailer = await this.service.updateRetailerRobotsTxt(slug);

    if (!retailer) {
      throw new NotFoundException('retailer not found', {
        cause: new Error(),
        description: `retailer with slug '${slug}' doesn't exist`,
      });
    }

    return retailer;
  }
}
