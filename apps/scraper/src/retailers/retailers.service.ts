import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SlugifyService } from '../slugify/slugify.service';
import { RobotsTxtService } from '../robots-txt/robots-txt.service';

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
    private readonly robotsTxt: RobotsTxtService,
  ) {}

  public async getRetailers() {
    return this.prisma.retailer.findMany({
      select: {
        name: true,
        slug: true,
        website_url: true,
        crawl_delay: true,
        updated_at: true,

        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        updated_at: 'asc',
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
        crawl_delay: true,

        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  }

  public async getRetailerDetailer(slug: string) {
    return this.prisma.retailer.findUnique({
      where: {
        slug,
      },
    });
  }

  public async createRetailer(data: RetailerCreateDto) {
    const robotsTxtUrl = new URL('/robots.txt', data.website_url);
    const robotsTxt = await this.robotsTxt.fetchAndParse(
      robotsTxtUrl.toString(),
    );

    const userAgent = this.robotsTxt.getBestMatchingUserAgent(
      robotsTxt,
      'DiscjaktBot',
    );

    const retailer = this.prisma.retailer.create({
      data: {
        ...data,
        slug: this.slugify.slugify(data.name),

        crawl_delay: userAgent?.crawlDelay ?? 1,
        allowed: userAgent?.allow.join(';') ?? '',
        disallowed: userAgent?.disallow.join(';') ?? '',
      },
      select: {
        name: true,
        slug: true,
        description: true,
        image_url: true,
        website_url: true,
        crawl_delay: true,
        allowed: true,
        disallowed: true,
      },
    });

    return retailer;
  }

  public async updateRetailer(slug: string, data: RetailerCreateDto) {
    const robotsTxtUrl = new URL('/robots.txt', data.website_url);
    const robotsTxt = await this.robotsTxt.fetchAndParse(
      robotsTxtUrl.toString(),
    );

    const userAgent = this.robotsTxt.getBestMatchingUserAgent(
      robotsTxt,
      'DiscjaktBot',
    );

    return this.prisma.retailer.update({
      where: {
        slug,
      },
      data: {
        ...data,
        slug: this.slugify.slugify(data.name),

        crawl_delay: userAgent?.crawlDelay ?? 1,
        allowed: userAgent?.allow.join(';') ?? '',
        disallowed: userAgent?.disallow.join(';') ?? '',
      },
      select: {
        name: true,
        slug: true,
        description: true,
        image_url: true,
        website_url: true,
        crawl_delay: true,
        allowed: true,
        disallowed: true,
      },
    });
  }

  public async updateRetailerRobotsTxt(slug: string) {
    const retailer = await this.getRetailer(slug);
    if (!retailer) {
      return null;
    }

    const robotsTxtUrl = new URL('/robots.txt', retailer.website_url);
    const robotsTxt = await this.robotsTxt.fetchAndParse(
      robotsTxtUrl.toString(),
    );

    const userAgent = this.robotsTxt.getBestMatchingUserAgent(
      robotsTxt,
      'DiscjaktBot',
    );

    return this.prisma.retailer.update({
      where: {
        slug,
      },
      data: {
        crawl_delay: userAgent?.crawlDelay ?? 1,
        allowed: userAgent?.allow.join(';') ?? '',
        disallowed: userAgent?.disallow.join(';') ?? '',
      },
      select: {
        name: true,
        slug: true,
        description: true,
        image_url: true,
        website_url: true,
        crawl_delay: true,
        allowed: true,
        disallowed: true,
      },
    });
  }
}
