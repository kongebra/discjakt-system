import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

export type UserAgent = {
  name: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
  sitemap?: string;
};

export type RobotsTxt = {
  userAgents: UserAgent[];

  sitemap?: string;
};

@Injectable()
export class RobotsTxtService {
  private readonly logger = new Logger(RobotsTxtService.name);

  constructor(private readonly http: HttpService) {}

  public parse(input: string): RobotsTxt | null {
    const lines = input.split('\n');
    const userAgents: any[] = [];
    let currentUserAgent: any = null;
    let sitemap: string | null = null;

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
        const currentSitemap = trimmedLine.split(':').slice(1).join(':').trim();
        if (currentUserAgent) {
          currentUserAgent.sitemap = currentSitemap;
        } else {
          sitemap = currentSitemap;
        }
      }
    }

    if (currentUserAgent) {
      userAgents.push(currentUserAgent);
    }

    return { userAgents, sitemap };
  }

  public async fetchAndParse(url: string): Promise<RobotsTxt | null> {
    try {
      const response = await this.http.axiosRef.get(url, {
        headers: {
          'User-Agent': 'DiscjaktBot',
        },
      });

      return this.parse(response.data);
    } catch (error) {
      this.logger.error(`Couldn't get robots.txt from ${url}`, error.message);

      return null;
    }
  }

  public getBestMatchingUserAgent(
    robotsTxt: RobotsTxt,
    userAgentName: string,
  ): UserAgent | null {
    const userAgent = robotsTxt.userAgents.find(
      (ua) => ua.name === userAgentName,
    );
    if (userAgent) {
      return userAgent;
    }

    const wildCardUserAgent = robotsTxt.userAgents.find(
      (ua) => ua.name === '*',
    );
    if (wildCardUserAgent) {
      return wildCardUserAgent;
    }

    if (robotsTxt.userAgents.length === 0) {
      return null;
    }

    return robotsTxt.userAgents[0];
  }
}
