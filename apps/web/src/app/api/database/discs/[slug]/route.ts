import { getDisc, getDiscs } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const disc = await getDisc({
    where: {
      slug: slug,
    },
  });

  if (!disc) {
    return NextResponse.json(
      {
        message: `Disc with slug "${slug}" not found.`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(disc);
}
