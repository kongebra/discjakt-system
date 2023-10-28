import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';

export type RobotsTxt = {
  userAgents: {
    name: string;
    allow?: string[];
    disallow?: string[];
    crawlDelay?: number;
    sitemap?: string;
  }[];
};

@Injectable()
export class RobotsTxtService {
  private readonly logger = new Logger(RobotsTxtService.name);

  constructor(private readonly http: HttpService) {}

  public parse(input: string): RobotsTxt | null {
    const lines = input.split('\n');
    const userAgents: any[] = [];
    let currentUserAgent: any = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('User-agent:')) {
        if (currentUserAgent) {
          userAgents.push(currentUserAgent);
        }
        currentUserAgent = {
          name: trimmedLine.split(':')[1].trim(),
          allow: [],
          disallow: [],
        };
      } else if (currentUserAgent && trimmedLine.startsWith('Disallow:')) {
        currentUserAgent.disallow.push(trimmedLine.split(':')[1].trim());
      } else if (currentUserAgent && trimmedLine.startsWith('Allow:')) {
        currentUserAgent.allow.push(trimmedLine.split(':')[1].trim());
      } else if (currentUserAgent && trimmedLine.startsWith('Crawl-delay:')) {
        currentUserAgent.crawlDelay = parseInt(
          trimmedLine.split(':')[1].trim(),
          10,
        );
      } else if (trimmedLine.startsWith('Sitemap:')) {
        currentUserAgent.sitemap = trimmedLine
          .split(':')
          .slice(1)
          .join(':')
          .trim();
      }
    }

    if (currentUserAgent) {
      userAgents.push(currentUserAgent);
    }

    return { userAgents };
  }

  public async fetchAndParse(url: string): Promise<RobotsTxt | null> {
    try {
      const response = await this.http.axiosRef.get(url, {
        headers: {
          'User-Agent': 'DiscjaktBot',
        },
      });

      if (response.status !== 200) {
        return null;
      }

      return this.parse(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        return null;
      }

      this.logger.error("Couldn't get robots.txt", error.message);
      throw error;
    }
  }
}
