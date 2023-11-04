import { getProducts } from "@/lib/server";
import { ProductCategory } from "database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");

  const products = await getProducts({
    where: {
      category: {
        equals: category as ProductCategory,
      },
    },
    take: 32,
  });

  return NextResponse.json(products.map((p) => p.name));
}
