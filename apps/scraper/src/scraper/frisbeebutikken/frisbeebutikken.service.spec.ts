import { Test, TestingModule } from '@nestjs/testing';
import { FrisbeebutikkenService } from './frisbeebutikken.service';

describe('FrisbeebutikkenService', () => {
  let service: FrisbeebutikkenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FrisbeebutikkenService],
    }).compile();

    service = module.get<FrisbeebutikkenService>(FrisbeebutikkenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
