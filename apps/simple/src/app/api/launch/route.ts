import { NextResponse } from "next/server";
import { prisma } from "@discjakt/db";

export async function GET() {
  const data = await prisma.launchSignUp.findMany();

  return NextResponse.json({ data });
}

