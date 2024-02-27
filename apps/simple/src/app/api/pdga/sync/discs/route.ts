import { prisma } from "@discjakt/db";
import { NextResponse } from "next/server";
import { fetchPdgaData, mapPDGADiscToDiscCreateManyInput } from "../../utils";

export async function GET() {
  const data = await fetchPdgaData();
  const existing = await prisma.disc.findMany({
    select: {
      slug: true,
    },
  });

  const existingSlugs = new Set(existing.map((d) => d.slug));

  const discsToCreate = data
    .map(mapPDGADiscToDiscCreateManyInput)
    .filter((d) => !existingSlugs.has(d.slug));

  try {
    let count = 0;
    if (discsToCreate.length) {
      const result = await prisma.disc.createMany({
        data: discsToCreate,
      });
      count = result.count;
    }

    return NextResponse.json({
      message: "ok",
      count,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "An error occurred",
        count: -1,
        data: discsToCreate,
      },
      { status: 500 },
    );
  }
}

