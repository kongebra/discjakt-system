import { prisma } from "@discjakt/db";
import { NextResponse } from "next/server";

export async function GET() {
  const manufacturers = await prisma.manufacturer.findMany();

  return NextResponse.json(manufacturers);
}

