import { Test, TestingModule } from '@nestjs/testing';
import { ProdiscService } from './prodisc.service';

describe('ProdiscService', () => {
  let service: ProdiscService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdiscService],
    }).compile();

    service = module.get<ProdiscService>(ProdiscService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
