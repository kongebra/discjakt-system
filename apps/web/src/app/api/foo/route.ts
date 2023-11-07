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
      select: {
        id: true,
        name: true,
        disc: {
          select: {
            slug: true,
          },
        },
      },
    }),
  ]);

  const testData = products.map((product) => [
    product.name,
    [(product as any).disc?.slug],
    product.id,
  ]);

  return NextResponse.json(testData);
}
