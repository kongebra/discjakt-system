import {
  getDiscs,
  getProducts,
  getRetailers,
  updateManyProducts,
  updateProduct,
  updateRetailer,
} from "@/lib/server";
import { NextResponse } from "next/server";
import { getProductDiscSuggestions } from "suggestor";

export async function GET(req: Request) {
  const [products] = await Promise.all([
    getProducts({
      where: {
        category: {
          equals: "DISC",
        },
      },
      take: 64,
      orderBy: {
        lastmod: "desc",
      },
    }),
  ]);

  const testData = products.map((product) => [product.name, product.disc_slug]);

  return NextResponse.json(testData);
}
