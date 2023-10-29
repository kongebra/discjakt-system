import { Controller, Get, Query } from '@nestjs/common';
import { Prisma } from 'database';
import { PrismaService } from '../prisma/prisma.service';

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  nextPage: string | null;
  prevPage: string | null;
};

const productSelect = {
  name: true,
  url: true,
  image_url: true,
  retailer_slug: true,
  category: true,
} satisfies Prisma.ProductSelect;

type ProductDto = Prisma.ProductGetPayload<{ select: typeof productSelect }>;

@Controller('products')
export class ProductsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async products(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 50,
  ): Promise<PaginatedResponse<ProductDto>> {
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        select: productSelect,
        skip,
        take: pageSize,
      }),
      this.prisma.product.count(),
    ]);

    const response: PaginatedResponse<ProductDto> = {
      data,
      total,
      page,
      pageSize,
      nextPage:
        page > 1 ? `/products?page=${page - 1}&pageSize=${pageSize}` : null,
      prevPage:
        page * pageSize < total
          ? `/products?page=${page + 1}&pageSize=${pageSize}`
          : null,
    };

    return response;
  }
}
