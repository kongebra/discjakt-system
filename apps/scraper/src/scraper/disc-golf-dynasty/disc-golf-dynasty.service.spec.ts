import { Test, TestingModule } from '@nestjs/testing';
import { DiscGolfDynastyService } from './disc-golf-dynasty.service';
import { CoreModule } from '../../core/core.module';
import { UtilsModule } from '../../utils/utils.module';

describe('DiscGolfDynastyService', () => {
  let service: DiscGolfDynastyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscGolfDynastyService],
      imports: [CoreModule, UtilsModule],
    }).compile();

    service = module.get<DiscGolfDynastyService>(DiscGolfDynastyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
