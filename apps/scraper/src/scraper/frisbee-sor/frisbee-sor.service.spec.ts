import { Test, TestingModule } from '@nestjs/testing';
import { FrisbeeSorService } from './frisbee-sor.service';

describe('FrisbeeSorService', () => {
  let service: FrisbeeSorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FrisbeeSorService],
    }).compile();

    service = module.get<FrisbeeSorService>(FrisbeeSorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
