import { prisma } from "@discjakt/db";
import { NextResponse } from "next/server";

export async function GET() {
  const discs = await prisma.disc.findMany();

  return NextResponse.json({ discs });
}

