import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type RetailerCreateDto = {
  name: string;
  website_url: string;
};

@Injectable()
export class RetailersService {
  constructor(private readonly prisma: PrismaService) {}

  public async getRetailers() {
    return this.prisma.retailer.findMany();
  }

  public async getRetailer(slug: string) {
    return this.prisma.retailer.findUnique({
      where: {
        slug,
      },
    });
  }

  //   public async createRetailer(data: RetailerCreateDto) {
  //     return this.prisma.retailer.create({
  //       data: data,
  //     });
  //   }
}
