import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import { HttpModule } from '@nestjs/axios';
import { PriceParserService } from '../price-parser/price-parser.service';

describe('ScraperService', () => {
  let service: ScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PriceParserService, ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const tests: {
    site: string;
    url: string;
    expected: {
      title: string;
      price: number;
    };
  }[] = [
    {
      site: 'aceshop.no',
      url: 'https://aceshop.no/products/k3-kaxe',
      expected: {
        title: 'K3 Kaxe',
        price: 129,
      },
    },
    {
      site: 'discgolf-wheelie.no',
      url: 'https://discgolf-wheelie.no/butikkkatalog/32-kastaplast/129-k1-falk/',
      expected: {
        title: 'K1 Falk',
        price: 180,
      },
    },
    {
      site: 'discgolfdynasty.no',
      url: 'https://www.discgolfdynasty.no/products/discmania-s-line-fd3',
      expected: {
        title: 'Discmania S-Line FD3',
        price: 229,
      },
    },
    {
      site: 'discoverdiscs.no',
      url: 'https://discoverdiscs.no/products/royal-driver-rive',
      expected: {
        title: 'Royal Rive',
        price: 269,
      },
    },
    {
      site: 'discshopen.no',
      url: 'https://discshopen.no/produkt/s-line-dd/',
      expected: {
        title: 'S-Line DD',
        price: 239,
      },
    },
    {
      site: 'discsjappa.no',
      url: 'https://discsjappa.no/products/m3-400',
      expected: {
        title: 'M3 400',
        price: 195,
      },
    },
    {
      site: 'discsor.no',
      url: 'https://discsor.no/products/neutron-watt',
      expected: {
        title: 'Neutron Watt',
        price: 195,
      },
    },
    {
      site: 'frisbeebutikken.no',
      url: 'https://frisbeebutikken.no/products/neutron-anode',
      expected: {
        title: 'Neutron Anode',
        price: 209,
      },
    },
    {
      site: 'frisbeesor.no',
      url: 'https://www.frisbeesor.no/produkt/stig-k1/',
      expected: {
        title: 'Stig K1',
        price: 199,
      },
    },
    {
      site: 'golfdiscer.no',
      url: 'https://golfdiscer.no/collections/nyheter/products/400-archive',
      expected: {
        title: '400 Archive',
        price: 205,
      },
    },
    {
      site: 'golfkongen.no',
      url: 'https://golfkongen.no/discgolf/origio-burst-underworld-driver-lattitude64',
      expected: {
        title: 'Origio Burst Underworld',
        price: 149,
      },
    },
    {
      site: 'kastmeg.no',
      url: 'https://kastmeg.no/products/enigma-special-edition-2023',
      expected: {
        title: 'Enigma special edition',
        price: 178,
      },
    },
    {
      site: 'prodisc.no',
      url: 'https://prodisc.no/products/royal-grand-honor',
      expected: {
        title: 'Royal Grand Honor',
        price: 269,
      },
    },
    {
      site: 'sendeskive.no',
      url: 'https://sendeskive.no/products/discmania-mentor-active-premium',
      expected: {
        title: 'Mentor',
        price: 199,
      },
    },
    {
      site: 'wearediscgolf.no',
      url: 'https://wearediscgolf.no/produkt/chrome-line-atlantis-first-run/',
      expected: {
        title: 'Chrome Line Atlantis First Run',
        price: 199,
      },
    },
    {
      site: 'krokholdgs.no',
      url: 'https://www.krokholdgs.no/products/gold-river',
      expected: {
        title: 'Gold River',
        price: 209,
      },
    },
    {
      site: 'dgshop.no',
      url: 'https://www.dgshop.no/gold-ballista-pro',
      expected: {
        title: 'Gold Ballista Pro',
        price: 205,
      },
    },
  ];

  describe.each(tests)('Dynamic tests', (test) => {
    it(`should scrape product page for ${test.site}`, async () => {
      const result = await service.scrape(test.url);

      expect(result.title.toLowerCase()).toContain(
        test.expected.title.toLowerCase(),
      );
      expect(result.price).toEqual(test.expected.price);
      expect(result.image_url).toBeDefined();
      expect(result.description).toBeDefined();
    });
  });
});
