import {
  getDiscs,
  getProducts,
  getRetailers,
  updateManyProducts,
  updateRetailer,
} from "@/lib/server";
import { NextResponse } from "next/server";
import { getProductDiscSuggestions } from "suggestor";

export async function GET(req: Request) {
  const [products, discs] = await Promise.all([
    getProducts({
      where: {
        category: {
          equals: "NOT_SET",
        },
        AND: [
          {
            name: {
              contains: "grip eq",
              mode: "insensitive",
            },
          },
        ],
      },
    }),
    getDiscs(),
  ]);

  const slugs = discs.map((disc) => disc.slug);

  const result = products.map((product) => {
    return {
      product,
      suggestions: getProductDiscSuggestions(product.name, slugs),
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
        category: "OTHER",
      },
    });
  }

  return NextResponse.json({ result });
}
