import { NextResponse } from "next/server";
import { fetchPdgaData } from "./utils";

export async function GET() {
  const data = await fetchPdgaData();

  return NextResponse.json(
    data
      .filter((i) => i["Disc Model"].toLowerCase().includes("torque"))
      .map((i) => [i["Disc Model"], i["Manufacturer / Distributor"]]),
  );
}

