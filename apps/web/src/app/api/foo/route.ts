import {
  getDiscs,
  getProducts,
  updateManyProducts,
  updateProduct,
} from "@/lib/server";
import { NextResponse } from "next/server";
import { getProductDiscSuggestions } from "suggestor";

export async function GET(req: Request) {
  // const products = await getProducts({
  //   where: {
  //     category: {
  //       equals: "DISC",
  //     },
  //   },
  // });
  const [products, discs] = await Promise.all([
    getProducts({
      where: {
        category: {
          equals: "NOT_SET",
        },
        OR: [
          {
            name: {
              contains: "umbrella",
              mode: "insensitive",
            },
          },
        ],
      },
    }),
    getDiscs(),
  ]);

  // await updateManyProducts({
  //   where: {
  //     id: {
  //       in: [
  //         "cloetxko3021qlhnwa2svf4fk",
  //         "cloetxlzy0228lhnwlemnlmdd",
  //         "cloetxmsq022ilhnwkztdozsw",
  //       ],
  //     },
  //   },
  //   data: {
  //     category: "OTHER",
  //   },
  // });

  const discSlugs = discs.map((d) => d.slug);

  const result = products.map((product) => {
    const suggestions = getProductDiscSuggestions(product.name, discSlugs);

    return {
      product,
      suggestions,
    };
  });

  const update = false;
  if (update) {
    await updateManyProducts({
      where: {
        id: {
          in: products.map((p) => p.id),
        },
      },
      data: {
        category: "ACCESSORY",
      },
    });
  }

  const allOneSuggestion = result.every((p) => p.suggestions.length === 1);
  if (allOneSuggestion) {
    // await Promise.all(
    //   result.map((r) =>
    //     updateProduct({
    //       where: {
    //         id: r.product.id,
    //       },
    //       data: {
    //         category: "DISC",
    //         disc_slug: r.suggestions[0],
    //       },
    //     })
    //   )
    // );
  }

  // const result = products
  //   .filter((p) => {
  //     const badData: string[] = [
  //       "Pro KC-PRO Putt assortert farge Innova - GolfKongen",
  //     ];
  //     if (badData.includes(p.name)) {
  //       return false;
  //     }

  //     return true;
  //   })
  //   .map((p) => [p.name, [p.disc_slug]]);

  return NextResponse.json({
    count: result.length,
    allOneSuggestion,
    what: result.filter((p) => p.suggestions.length !== 1),
    products: result.map((p) => ({
      name: p.product.name,
      url: p.product.url,
      image_url: p.product.image_url,
      suggestions: p.suggestions,
    })),
    // result,
  });
}
