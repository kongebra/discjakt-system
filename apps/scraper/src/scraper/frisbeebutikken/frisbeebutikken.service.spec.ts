import { Test, TestingModule } from '@nestjs/testing';
import { FrisbeebutikkenService } from './frisbeebutikken.service';
import { CoreModule } from '../../core/core.module';
import { UtilsModule } from '../../utils/utils.module';

describe('FrisbeebutikkenService', () => {
  let service: FrisbeebutikkenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FrisbeebutikkenService],
      imports: [CoreModule, UtilsModule],
    }).compile();

    service = module.get<FrisbeebutikkenService>(FrisbeebutikkenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
