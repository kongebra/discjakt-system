import { getDiscs } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const discs = await getDiscs();

  return NextResponse.json(discs.map((disc) => disc.slug).sort());
}
