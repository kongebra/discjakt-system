import { Test, TestingModule } from '@nestjs/testing';
import { SlugifyService } from './slugify.service';

describe('SlugifyService', () => {
  let service: SlugifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlugifyService],
    }).compile();

    service = module.get<SlugifyService>(SlugifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should slugify text correctly', () => {
    const result = service.slugify('Hello World');
    expect(result).toEqual('hello-world');
  });

  it('should handle multiple spaces', () => {
    const result = service.slugify('Hello    World');
    expect(result).toEqual('hello-world');
  });

  it('should handle special characters', () => {
    const result = service.slugify('Hello $ World');
    expect(result).toEqual('hello-world');
  });

  it('should handle multiple dashes', () => {
    const result = service.slugify('Hello--World');
    expect(result).toEqual('hello-world');
  });

  it('should handle leading and trailing dashes', () => {
    const result = service.slugify('-Hello World-');
    expect(result).toEqual('hello-world');
  });

  it('should throw error for null or undefined', () => {
    expect(() => service.slugify(null)).toThrow(
      'Invalid text provided for slugification',
    );
    expect(() => service.slugify(undefined)).toThrow(
      'Invalid text provided for slugification',
    );
  });
});
