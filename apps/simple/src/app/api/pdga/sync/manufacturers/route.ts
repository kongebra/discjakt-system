import { prisma } from "@discjakt/db";
import { NextResponse } from "next/server";
import {
  fetchPdgaData,
  mapPDGADiscToManufacturerCreateManyInput,
} from "../../utils";

export async function GET() {
  const data = await fetchPdgaData();
  const existing = await prisma.manufacturer.findMany({
    select: {
      slug: true,
    },
  });

  const existingSet = new Set(
    existing.map((manufacturer) => manufacturer.slug),
  );

  const manufacturerToCreate = data
    .map(mapPDGADiscToManufacturerCreateManyInput)
    .filter((item) => !existingSet.has(item.slug));

  let count = 0;
  if (manufacturerToCreate.length) {
    const result = await prisma.manufacturer.createMany({
      data: manufacturerToCreate,
    });

    count = result.count;
  }

  return NextResponse.json({
    message: "ok",
    count,
  });
}

