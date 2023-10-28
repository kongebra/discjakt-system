import { Test, TestingModule } from '@nestjs/testing';
import { RetailersService } from './retailers.service';
import { PrismaService } from '../prisma/prisma.service';
import { SlugifyService } from '../slugify/slugify.service';

describe('RetailersService', () => {
  let service: RetailersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetailersService, PrismaService, SlugifyService],
    }).compile();

    service = module.get<RetailersService>(RetailersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
