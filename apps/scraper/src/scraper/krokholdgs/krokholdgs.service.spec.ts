import { Test, TestingModule } from '@nestjs/testing';
import { KrokholdgsService } from './krokholdgs.service';

describe('KrokholdgsService', () => {
  let service: KrokholdgsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KrokholdgsService],
    }).compile();

    service = module.get<KrokholdgsService>(KrokholdgsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
