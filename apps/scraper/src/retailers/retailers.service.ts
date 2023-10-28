import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SlugifyService } from '../slugify/slugify.service';

export type RetailerCreateDto = {
  name: string;
  website_url: string;
  description?: string | null;
  image_url?: string | null;
};

@Injectable()
export class RetailersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slugify: SlugifyService,
  ) {}

  public async getRetailers() {
    return this.prisma.retailer.findMany({
      select: {
        name: true,
        slug: true,
        description: true,
        image_url: true,
        website_url: true,
      },
    });
  }

  public async getRetailer(slug: string) {
    return this.prisma.retailer.findUnique({
      where: {
        slug,
      },
      select: {
        name: true,
        slug: true,
        description: true,
        image_url: true,
        website_url: true,
      },
    });
  }

  public async createRetailer(data: RetailerCreateDto) {
    return this.prisma.retailer.create({
      data: {
        ...data,
        slug: this.slugify.slugify(data.name),
      },
      select: {
        name: true,
        slug: true,
        description: true,
        image_url: true,
        website_url: true,
      },
    });
  }

  public async updateRetailer(slug: string, data: RetailerCreateDto) {
    return this.prisma.retailer.update({
      where: {
        slug,
      },
      data: {
        ...data,
        slug: this.slugify.slugify(data.name),
      },
      select: {
        name: true,
        slug: true,
        description: true,
        image_url: true,
        website_url: true,
      },
    });
  }
}
