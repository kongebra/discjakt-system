import { Test, TestingModule } from '@nestjs/testing';
import { ScraperController } from './scraper.controller';
import { HttpModule } from '@nestjs/axios';
import { ScraperService } from './scraper.service';
import { PriceParserService } from '../price-parser/price-parser.service';

describe('ScraperController', () => {
  let controller: ScraperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PriceParserService, ScraperService],
      controllers: [ScraperController],
    }).compile();

    controller = module.get<ScraperController>(ScraperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
