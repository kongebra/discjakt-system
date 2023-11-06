import { getRetailers, updateRetailer } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json({});
}
