import { Test, TestingModule } from '@nestjs/testing';
import { PriceParserService } from './price-parser.service';

describe('PriceParserService', () => {
  let service: PriceParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriceParserService],
    }).compile();

    service = module.get<PriceParserService>(PriceParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return null for invalid price', () => {
    expect(service.parse('')).toBeNull();
    expect(service.parse('abc')).toBeNull();
    expect(service.parse('abc123')).toBeNull();
    expect(service.parse('123abc')).toBeNull();
    expect(service.parse('123abc123')).toBeNull();
    expect(service.parse('abc123abc')).toBeNull();
  });

  it('should return 100', () => {
    expect(service.parse('100')).toBe(100);
    expect(service.parse('100,-')).toBe(100);
    expect(service.parse('kr 100')).toBe(100);
    expect(service.parse('kr 100 ,-')).toBe(100);
    expect(service.parse('100 NOK')).toBe(100);
    expect(service.parse('kr 100 NOK')).toBe(100);
    expect(service.parse('100.00')).toBe(100);
    expect(service.parse('100,00')).toBe(100);
    expect(service.parse('100,00 NOK')).toBe(100);
    expect(service.parse('100.00 NOK')).toBe(100);
    expect(service.parse('100,00 kr')).toBe(100);
    expect(service.parse('kr 100.00')).toBe(100);
  });

  it('should return correct values (real values)', () => {
    expect(service.parse('269,00')).toBe(269);
    expect(service.parse('215,00 NOK')).toBe(215);
    expect(service.parse('1.999,00 kr')).toBe(1999);
    expect(service.parse('125,00 kr')).toBe(125);
    expect(service.parse('kr 1349')).toBe(1349);
    expect(service.parse('259,00 NOK')).toBe(259);
    expect(service.parse(' 425,00 kr ')).toBe(425);
    expect(service.parse('93,-')).toBe(93);
    expect(service.parse('kr 259.00')).toBe(259);
    expect(service.parse('2.499,00 kr')).toBe(2499);
    expect(service.parse('1 529,-')).toBe(1529);
    expect(service.parse(' 62,00 NOK ')).toBe(62);
    expect(service.parse('1.499,00 NOK')).toBe(1499);
    expect(service.parse('209,00 kr')).toBe(209);
    expect(service.parse('kr 299 ,-')).toBe(299);
  });

  it('should have øre as decimal', () => {
    expect(service.parse('99.50,-')).toBe(99.5);
    expect(service.parse('199.99,-')).toBe(199.99);
    expect(service.parse('149,50')).toBe(149.5);
    expect(service.parse('kr 49.90')).toBe(49.9);
    expect(service.parse('1.499,99')).toBe(1499.99);
    expect(service.parse('1.499,49')).toBe(1499.49);
    expect(service.parse('1.499,50')).toBe(1499.5);
    expect(service.parse('1.499,51')).toBe(1499.51);
  });
});
