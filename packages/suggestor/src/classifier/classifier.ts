import {
  Orama,
  Results,
  SearchParams,
  TypedDocument,
  create,
  insertMultiple,
  search,
} from "@orama/orama";
import { Disc } from "database";
import compromise from "compromise";

let discSearchEngine: Orama<typeof discSchema> | null = null;

export async function getDiscSearchEngine(
  discs: Disc[]
): Promise<Orama<typeof discSchema>> {
  if (discSearchEngine) {
    return discSearchEngine;
  }

  discSearchEngine = await createSearchEngine(discs);

  return discSearchEngine;
}

export function applyRules(input: string): string {
  return "";
}

export async function classifyProduct(productName: string, discs: Disc[]) {
  //   const engine = await getDiscSearchEngine(discs);

  const name: string = preprocessProductName(productName, discs);

  return null;
}

const discSchema = {
  name: "string",
  slug: "string",
  description: "string",
  speed: "number",
  glide: "number",
  turn: "number",
  fade: "number",
  type: "enum",
} as const;

export type DiscDocument = TypedDocument<Orama<typeof discSchema>>;

async function createSearchEngine(discs: Disc[]) {
  const db: Orama<typeof discSchema> = await create({
    schema: discSchema,
  });

  const data = discs.map((disc) => ({
    name: disc.name,
    slug: disc.slug,
    description: disc.description || "",
    speed: disc.speed,
    glide: disc.glide,
    turn: disc.turn,
    fade: disc.fade,
    type: disc.type as string,
  }));

  await insertMultiple(db, data);

  return db;
}

function preprocessProductName(productName: string, discs: Disc[]): string {
  let doc = compromise(productName);
  doc.toLowerCase();

  const slugs = discs.map((disc) => disc.slug.toLowerCase());

  let terms = doc.terms().out("array") as string[];

  terms = terms.map((term) => term.replaceAll(" -", "").trim());

  console.log(productName, { terms });

  terms = terms.filter((term) => {
    return slugs.includes(term);
  });

  let output = terms.join(" ");

  return output;
}
