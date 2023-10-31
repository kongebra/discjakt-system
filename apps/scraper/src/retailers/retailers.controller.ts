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
import { TasksService } from 'src/tasks/tasks.service';

@Controller('retailers')
export class RetailersController {
  constructor(
    private readonly service: RetailersService,
    private readonly tasksService: TasksService,
  ) {}

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

  @Post(':slug/crawl')
  async crawlBySlug(@Param('slug') slug: string) {
    const retailer = await this.service.getRetailerDetailer(slug);

    if (!retailer) {
      throw new NotFoundException('retailer not found', {
        cause: new Error(),
        description: `retailer with slug '${slug}' doesn't exist`,
      });
    }

    await this.tasksService.doRetailer(retailer);

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
