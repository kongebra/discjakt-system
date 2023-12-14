import { Test, TestingModule } from '@nestjs/testing';
import { FrisbeeSorService } from './frisbee-sor.service';
import { CoreModule } from '../../core/core.module';
import { UtilsModule } from '../../utils/utils.module';

describe('FrisbeeSorService', () => {
  let service: FrisbeeSorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FrisbeeSorService],
      imports: [CoreModule, UtilsModule],
    }).compile();

    service = module.get<FrisbeeSorService>(FrisbeeSorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
