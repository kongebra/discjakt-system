import { getDiscs, getProducts } from "@/lib/server";
import { NextResponse } from "next/server";
import * as natural from "natural";
import { blacklist } from "suggestor";

function cleanProductName(productName: string): string {
  let output = productName.toLowerCase();
  const tokens = new natural.AggressiveTokenizer().tokenize(output);

  const fileteredTokens = tokens.filter((token) => {
    return !blacklist.includes(token);
  });

  output = fileteredTokens.join(" ");

  blacklist.forEach((blacklisted) => {
    output = output.replaceAll(blacklisted, "");
  });

  output = output.trim();

  return output;
}

function shuffle<T>(input: T[]): T[] {
  const output = [...input];

  for (let i = output.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [output[i], output[j]] = [output[j], output[i]];
  }

  return output;
}

export async function GET(req: Request) {
  const [products] = await Promise.all([
    getProducts({
      where: {
        category: "DISC",
      },
    }),
  ]);

  const shuffled = shuffle(products);
  const pick = shuffled.slice(0, 16).map((x) => [x.name, ""]);

  return NextResponse.json(pick);
}
