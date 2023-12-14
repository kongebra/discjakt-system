import { Test, TestingModule } from '@nestjs/testing';
import { KrokholdgsService } from './krokholdgs.service';
import { CoreModule } from '../../core/core.module';
import { UtilsModule } from '../../utils/utils.module';

describe('KrokholdgsService', () => {
  let service: KrokholdgsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KrokholdgsService],
      imports: [CoreModule, UtilsModule],
    }).compile();

    service = module.get<KrokholdgsService>(KrokholdgsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
