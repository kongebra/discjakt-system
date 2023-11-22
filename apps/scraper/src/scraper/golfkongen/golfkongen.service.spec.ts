import { Test, TestingModule } from '@nestjs/testing';
import { GolfkongenService } from './golfkongen.service';

describe('GolfkongenService', () => {
  let service: GolfkongenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GolfkongenService],
    }).compile();

    service = module.get<GolfkongenService>(GolfkongenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
