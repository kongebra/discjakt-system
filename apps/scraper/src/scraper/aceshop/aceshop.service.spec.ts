import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import type { AxiosResponse } from 'axios';
import { CoreModule } from '../../core/core.module';
import { UtilsModule } from '../../utils/utils.module';
import { AceshopService } from './aceshop.service';

jest.doMock('@nestjs/axios', () => ({
  HttpService: {
    axiosRef: {
      get: jest.fn(),
    },
  },
}));

describe('AceshopService', () => {
  let service: AceshopService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule, UtilsModule],
      providers: [AceshopService],
    }).compile();

    service = module.get<AceshopService>(AceshopService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const testCases = [
    {
      description: 'Test case for K1 Berg',
      url: 'https://aceshop.no/products/k1-berg1',
      mockResponse: {
        data: `<!DOCTYPE>
<html lang="no">

<head>
    <meta charset="ISO-8859-1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>K1 Berg - Aceshop</title>
    <script type="text/javascript">
        var product = {
            id: 1294,
            categories: {
                0: '97', 1: '113', 2: '136'
            },
            isPackage: false,
            quantity: 69,
            customer_group: "",
            stock_text: "<b>På lager<\/b>: 69",
            stock_group: "",
            price: '189.00',
            retail_price_ex: "",
            retail_price_inc: "",
            tax_rate: "25",
            available_date: "",
            products_stock_group_id: '',
            tags: {
                "Speed": "1", "Glide": "1", "Turn": "0.", "Fade": "2"
            },
            button_type: 'buy_now_button',
            meta_description: \`<p>The Berg can be trusted not to hover far passed the basket even on windy days. What characterizes Berg when thrown off tee is its good high speed stability, without a very hard fade, a combination that makes this disc easy to shape various lines...\`,
            product_date_available: '0000-00-00 00:00:00',
            weight: 180,
            isBundle: false
        };
    </script>
</head>

<body>
    <div class="breadcrumb">
        <a href="https://aceshop.no">Hjem</a>
        <a href="https://aceshop.no/categories/discer"><i class="fal fa-angle-right" style="margin: 2px 8px 0 0;"></i>
            Discer</a>
        <a href="https://aceshop.no/categories/kastaplast"><i class="fal fa-angle-right"
                style="margin: 2px 8px 0 0;"></i>
            Kastaplast</a>
        <a href="https://aceshop.no/categories/k1"><i class="fal fa-angle-right" style="margin: 2px 8px 0 0;"></i>
            K1</a>
        <a href="https://aceshop.no/products/k1-berg1"><i class="fal fa-angle-right" style="margin: 2px 8px 0 0;"></i>
            K1
            Berg</a>
    </div>
    <h1 class="product-title-v1">
        K1 Berg
    </h1>

    <div class="product_stock stock_box">
        <b>På lager</b>: 69
    </div>

    <span class="product-price products_price ">189,00</span>

    <span>
        <a title="K1 Berg" onclick="openProduct(1)" class="gallery" href="javascript:void(0)">
            <img class="img-fluid fit-prod-page fit-prod-page5050 "
                src="https://aceshopas-i03.mycdn.no/mysimgprod/aceshopas_mystore_no/images/89642_Kastaplast_K1_Berg1_1.jpg/w960h1200.jpg"
                alt="K1 Berg" alt="K1 Berg">
        </a>
    </span>

    <span itemprop="brand">
        <a href="https://aceshop.no/manufacturers/kastaplast" title="">Kastaplast
        </a>
    </span>
</body>

</html>`,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      } as AxiosResponse,
      expected: {
        data: {
          name: 'K1 Berg',
          price: 189,
          originalPrice: 189,
          inStock: true,
          quantity: 69,
          image:
            'https://aceshopas-i03.mycdn.no/mysimgprod/aceshopas_mystore_no/images/89642_Kastaplast_K1_Berg1_1.jpg/w960h1200.jpg',
          speed: 1,
          glide: 1,
          turn: 0,
          fade: 2,
          category: 'Discer',
          brand: 'Kastaplast',
          retailerSlug: 'aceshop',
          url: 'https://aceshop.no/products/k1-berg1',
        },
        meta: {
          url: 'https://aceshop.no/products/k1-berg1',
          retailerSlug: 'aceshop',
          scraperName: 'aceshop',
          scrapedAt: expect.any(Date),
          httpStatus: 200,
          httpStatusText: 'OK',
        },
      },
    },

    {
      description: 'Test case for GRIP eq Paige Pierce BX3 Signature Series',
      url: 'https://aceshop.no/products/grip-eq-paige-pierce-bx3-signature-series',
      mockResponse: {
        data: `<!DOCTYPE html>
<html>

<head>
    <meta charset="ISO-8859-1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>
        GRIP eq Paige Pierce BX3 Signature Series - Aceshop
    </title>
    <script type="text/javascript">
        var product = {
            id: 1838,
            categories: {
                0: '98', 1: '121'
            },
            isPackage: false,
            quantity: 31,
            customer_group: "",
            stock_text: "<b>På lager<\/b>: 31",
            stock_group: "",
            price: '1.649.45',
            retail_price_ex: "",
            retail_price_inc: "",
            tax_rate: "25",
            available_date: "",
            products_stock_group_id: '',
            tags: {
            },
            button_type: 'buy_now_button',
            meta_description: \`<p>All&#160;GRIPeq&#169; Disc Golf Bags combine market-leading design and innovation with superior materials and workmanship to deliver steadfast durability, optimum functionality, and unparalleled ORIGINAL&#160;GRIP&#169; player comfort.</p>...\`,
            product_date_available: '0000-00-00 00:00:00',
            weight: 2100,
            isBundle: false
        };
    </script>
</head>

<body>
    <h1 class="product-title-v1">
        GRIP eq Paige Pierce BX3 Signature Series
    </h1>
    <div class="prices text-adjust-sm">
        <div class="d-inline discountarea text-adjust-sm">
            <div id="productdiscount" class="d-inline">45% Rabatt</div>
            <s class="products_price_old price-old d-inline">2.999,00</s>
        </div>
        <span class="product-price products_price special d-block" data-foo="bar">1.649,45</span>
    </div>
    <div class="breadcrumb">
        <a href="https://aceshop.no">Hjem</a>
        <a href="https://aceshop.no/categories/sekker"><i class="fal fa-angle-right" style="margin: 2px 8px 0 0;"></i>
            Sekker</a>
        <a href="https://aceshop.no/categories/grip"><i class="fal fa-angle-right" style="margin: 2px 8px 0 0;"></i>
            Grip</a>
        <a href="https://aceshop.no/products/grip-eq-paige-pierce-bx3-signature-series"><i class="fal fa-angle-right"
                style="margin: 2px 8px 0 0;"></i> GRIP eq Paige Pierce BX3 Signature Series</a>
    </div>

    <div class="swiper-slide">
        <a title="GRIP eq Paige Pierce BX3 Signature Series" onclick="openProduct(1)" class="gallery"
            href="javascript:void(0)">
            <img class="img-fluid fit-prod-page fit-prod-page5050 "
                src="https://aceshopas-i03.mycdn.no/mysimgprod/aceshopas_mystore_no/images/23184_Grip_GRIP_eq_Paige_Pierce_BX3_Signature_Seri_1.jpg/w1200h1200.jpg"
                alt="GRIP eq Paige Pierce BX3 Signature Series" alt="GRIP eq Paige Pierce BX3 Signature Series">
        </a>
    </div>
    <div class="swiper-slide">
        <a title="GRIP eq Paige Pierce BX3 Signature Series" onclick="openProduct(2)" class="gallery"
            href="javascript:void(0)">
            <img class="img-fluid fit-prod-page fit-prod-page5050 "
                src="https://aceshopas-i05.mycdn.no/mysimgprod/aceshopas_mystore_no/images/23184_Grip_GRIP_eq_Paige_Pierce_BX3_Signature_Seri_2.jpg/w1200h1200.jpg"
                alt="GRIP eq Paige Pierce BX3 Signature Series" alt="GRIP eq Paige Pierce BX3 Signature Series">
        </a>
    </div>
    <div class="swiper-slide">
        <a title="GRIP eq Paige Pierce BX3 Signature Series" onclick="openProduct(3)" class="gallery"
            href="javascript:void(0)">
            <img class="img-fluid fit-prod-page fit-prod-page5050 "
                src="https://aceshopas-i03.mycdn.no/mysimgprod/aceshopas_mystore_no/images/23714_Grip_GRIP_eq_Paige_Pierce_BX3_Signature_Seri_1.png/w1200h1200.png"
                alt="GRIP eq Paige Pierce BX3 Signature Series" alt="GRIP eq Paige Pierce BX3 Signature Series">
        </a>
    </div>

    <div class="product_stock stock_box">
        <b>På lager</b>: 31
    </div>

    <span itemprop="brand">
        <a href="https://aceshop.no/manufacturers/grip" title="">Grip
        </a>
    </span>
</body>

</html>`,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      },
      expected: {
        data: {
          name: 'GRIP eq Paige Pierce BX3 Signature Series',
          price: 1649.45,
          originalPrice: 2999,
          inStock: true,
          quantity: 31,
          image:
            'https://aceshopas-i03.mycdn.no/mysimgprod/aceshopas_mystore_no/images/23184_Grip_GRIP_eq_Paige_Pierce_BX3_Signature_Seri_1.jpg/w1200h1200.jpg',
          speed: 0,
          glide: 0,
          turn: 0,
          fade: 0,
          category: 'Sekker',
          brand: 'Grip',
          retailerSlug: 'aceshop',
          url: 'https://aceshop.no/products/grip-eq-paige-pierce-bx3-signature-series',
        },
        meta: {
          url: 'https://aceshop.no/products/grip-eq-paige-pierce-bx3-signature-series',
          retailerSlug: 'aceshop',
          scraperName: 'aceshop',
          scrapedAt: expect.any(Date),
          httpStatus: 200,
          httpStatusText: 'OK',
        },
      },
    },
  ];

  test.each(testCases)(
    'should scrape successfully - $description',
    async (testCase) => {
      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockImplementationOnce(() =>
          Promise.resolve(testCase.mockResponse as AxiosResponse),
        );

      const result = await service.scrape(testCase.url);

      expect(result).toEqual(testCase.expected);
    },
  );
});
