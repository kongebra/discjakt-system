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

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const update = searchParams.get("update");

  const [products, discs] = await Promise.all([
    getProducts({
      where: {
        id: {
          equals: id,
        },
      },
    }),
    getDiscs(),
  ]);

  const slugs = discs.map((d) => d.slug);

  const results = products.map((product) => {
    return {
      product,
      suggestions: getProductDiscSuggestions(product.name, slugs),
    };
  });

  if (update === "true") {
    await updateProduct({
      where: {
        id: id,
      },
      data: {
        disc_slug: results[0].suggestions[0],
      },
    });
  }

  // await updateProduct({
  //   where: {
  //     id: "cloeu6ssl05jclhnwyzadypb0",
  //   },
  //   data: {
  //     disc_slug: "stratus",
  //   },
  // });

  // await updateManyProducts({
  //   where: {
  //     id: {
  //       in: products.map((p) => p.id),
  //     },
  //   },
  //   data: {
  //     disc_slug: "rainmaker",
  //   },
  // });

  return NextResponse.json(results);

  // const [products] = await Promise.all([
  //   getProducts({
  //     where: {
  //       category: {
  //         equals: "DISC",
  //       },
  //     },
  //     select: {
  //       id: true,
  //       name: true,
  //       disc: {
  //         select: {
  //           slug: true,
  //         },
  //       },
  //     },
  //   }),
  // ]);

  // const testData = products.map((product) => [
  //   product.name,
  //   [(product as any).disc?.slug],
  //   product.id,
  // ]);

  // return NextResponse.json(testData);
}
