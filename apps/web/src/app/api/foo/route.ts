import { getProducts, updateManyProducts } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const products = await getProducts({
    where: {
      category: {
        equals: "DISC",
      },
    },
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
        category: "BASKET",
      },
    });
  }

  const result = products.map((p) => [p.name, [p.disc_slug]]);

  return NextResponse.json({
    count: products.length,
    // products: products.map((p) => ({
    //   id: p.id,
    //   name: p.name,
    //   url: p.url,
    // })),
    result,
  });
}
