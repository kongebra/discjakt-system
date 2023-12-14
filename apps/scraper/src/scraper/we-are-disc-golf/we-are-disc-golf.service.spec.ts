import { Test, TestingModule } from '@nestjs/testing';
import { WeAreDiscGolfService } from './we-are-disc-golf.service';
import { CoreModule } from '../../core/core.module';
import { UtilsModule } from '../../utils/utils.module';

describe('WeAreDiscGolfService', () => {
  let service: WeAreDiscGolfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeAreDiscGolfService],
      imports: [CoreModule, UtilsModule],
    }).compile();

    service = module.get<WeAreDiscGolfService>(WeAreDiscGolfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
