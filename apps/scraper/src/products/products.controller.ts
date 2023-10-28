import { Controller, Get } from '@nestjs/common';
import { Product } from 'database';
import { PrismaService } from '../prisma/prisma.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async products(): Promise<Product[]> {
    return await this.prisma.product.findMany();
  }
}
