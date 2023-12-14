import { Test, TestingModule } from '@nestjs/testing';
import { ScraperController } from './scraper.controller';
import { CoreModule } from '../core/core.module';
import { UtilsModule } from '../utils/utils.module';
import { ScraperModule } from './scraper.module';

describe('ScraperController', () => {
  let controller: ScraperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScraperController],
      imports: [CoreModule, UtilsModule, ScraperModule],
    }).compile();

    controller = module.get<ScraperController>(ScraperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
