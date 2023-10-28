import { Test, TestingModule } from '@nestjs/testing';
import { RetailersController } from './retailers.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RetailersService } from './retailers.service';
import { SlugifyService } from '../slugify/slugify.service';

describe('RetailersController', () => {
  let controller: RetailersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RetailersController],
      providers: [RetailersService, PrismaService, SlugifyService],
    }).compile();

    controller = module.get<RetailersController>(RetailersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
