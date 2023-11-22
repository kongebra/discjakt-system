import { Test, TestingModule } from '@nestjs/testing';
import { WeAreDiscGolfService } from './we-are-disc-golf.service';

describe('WeAreDiscGolfService', () => {
  let service: WeAreDiscGolfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeAreDiscGolfService],
    }).compile();

    service = module.get<WeAreDiscGolfService>(WeAreDiscGolfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
