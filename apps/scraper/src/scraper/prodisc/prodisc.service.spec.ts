import { Test, TestingModule } from '@nestjs/testing';
import { ProdiscService } from './prodisc.service';
import { CoreModule } from '../../core/core.module';
import { UtilsModule } from '../../utils/utils.module';

describe('ProdiscService', () => {
  let service: ProdiscService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdiscService],
      imports: [CoreModule, UtilsModule],
    }).compile();

    service = module.get<ProdiscService>(ProdiscService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
