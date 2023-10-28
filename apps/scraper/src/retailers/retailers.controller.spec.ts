import { Test, TestingModule } from '@nestjs/testing';
import { RetailersController } from './retailers.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RetailersService } from './retailers.service';

describe('RetailersController', () => {
  let controller: RetailersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RetailersController],
      providers: [RetailersService, PrismaService],
    }).compile();

    controller = module.get<RetailersController>(RetailersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
