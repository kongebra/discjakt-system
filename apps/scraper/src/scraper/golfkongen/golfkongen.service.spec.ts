import { Test, TestingModule } from '@nestjs/testing';
import { GolfkongenService } from './golfkongen.service';
import { CoreModule } from '../../core/core.module';
import { UtilsModule } from '../../utils/utils.module';

describe('GolfkongenService', () => {
  let service: GolfkongenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GolfkongenService],
      imports: [CoreModule, UtilsModule],
    }).compile();

    service = module.get<GolfkongenService>(GolfkongenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
