import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { TracerService } from '../core/tracer/tracer.service';
import { PriceParserService } from '../utils/price-parser/price-parser.service';

@Injectable()
export abstract class BaseScraperService {
  constructor(
    protected readonly http: HttpService,
    protected readonly tracer: TracerService,
    protected readonly priceParser: PriceParserService,
  ) {}
}
