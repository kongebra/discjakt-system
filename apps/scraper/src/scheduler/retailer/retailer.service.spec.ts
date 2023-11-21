import { Test, TestingModule } from '@nestjs/testing';
import { RetailerService } from './retailer.service';

describe('RetailerService', () => {
  let service: RetailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetailerService],
    }).compile();

    service = module.get<RetailerService>(RetailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
