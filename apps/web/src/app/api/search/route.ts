import { NextResponse } from "next/server";
import {
  create,
  search,
  insert,
  insertMultiple,
  TypedDocument,
  Orama,
  SearchParams,
  Results,
} from "@orama/orama";
import { getDiscs, getProducts } from "@/lib/server";
import { Disc } from "database";

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

type DiscDocument = TypedDocument<Orama<typeof discSchema>>;

async function createDiscSearchDatabase(discs: Disc[]) {
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

export async function GET(req: Request) {
  const discs = await getDiscs();
  const engine = await createDiscSearchDatabase(discs);

  const products = await getProducts({
    where: {
      category: "DISC",
    },
    take: 1000,
  });

  const discSlugs = discs.map((x) => x.slug);

  const test = await Promise.all(
    products.map(async (product) => {
      const term = clean(product.name, discSlugs);

      const searchParams: SearchParams<Orama<typeof discSchema>> = {
        term,
      };
      const result: Results<DiscDocument> = await search(engine, searchParams);

      return {
        id: product.id,
        name: product.name,
        term,
        guess: result.hits.length > 0 ? result.hits[0].document.slug : null,
        correct: product.disc_slug,
        wasCorrect:
          result.hits.length > 0
            ? result.hits[0].document.slug === product.disc_slug
            : false,
      };
    })
  );

  const correct = test.filter((x) => x.wasCorrect);
  const failed = test.filter((x) => !x.wasCorrect);
  const hitrate = correct.length / test.length;

  return NextResponse.json({
    hitrate,
    data: {
      failed,
      correct,
    },
  });
}

const NAME_CHECK = "raider";

function clean(productName: string, discSlugs: string[]): string {
  let name = productName.toLowerCase();

  const blacklist = [
    "x-out",
    "cosmic neutron",
    "cosmic electron",
    "nathan queen",
    "Wysocki Sockibomb",
    "eagle mcmahon",
  ].map((w) => w.toLowerCase());

  for (const blacklisted of blacklist) {
    name = name.replaceAll(blacklisted, "");
  }

  const specialRules: [string, string][] = [
    ["g�te", "gote"],
    ["st�l", "stal"],
    ["j�rn", "jarn"],
  ];
  for (const [search, replace] of specialRules) {
    name = name.replaceAll(search, replace);
  }

  name = name
    .replaceAll("-", " ")
    .replaceAll(".", " ")
    .replaceAll(",", " ")
    .replaceAll("ø", "o")
    .replaceAll("ö", "o")
    .replaceAll("å", "a")
    .replaceAll("ä", "a");

  const extendedDiscSlugs = discSlugs
    .filter((slug) => slug.includes("-"))
    .map((slug) => [
      [slug.replaceAll("-", " "), slug.replaceAll("-", "")],
      slug,
    ]) as [string[], string][];

  extendedDiscSlugs.forEach(([searchValues, replaceValue]) => {
    searchValues.forEach((searchValue) => {
      name = name.replaceAll(searchValue, replaceValue);
    });
  });

  const words = name.split(" ").filter((x) => !!x);
  let filteredWords = words.filter((word) =>
    [...extendedDiscSlugs, ...discSlugs].includes(word)
  );

  if (productName.toLowerCase().includes(NAME_CHECK)) {
    console.log("NAME_CHECK #1 ", {
      name,
      words,
      filteredWords,
    });
  }

  const knownDoubles = [
    "cosmic",
    "diamond",
    "queen",
    "eagle",
    "fury",
    "world",
    "force",
    "spectrum",
    "barbarian",
  ];
  if (filteredWords.length > 1) {
    for (const double of knownDoubles) {
      const index = filteredWords.indexOf(double);
      if (index > -1) {
        filteredWords.splice(index);

        if (filteredWords.length === 1) {
          break;
        }
      }
    }
  }

  name = filteredWords.join(" ");
  name = name.trim();

  if (productName.toLowerCase().includes(NAME_CHECK)) {
    console.log("NAME_CHECK #2 ", {
      name,
      words,
      filteredWords,
    });

    if (!name) {
      console.log("NAME_CHECK #3", {
        name,
        words,
        filteredWords,
      });
    }
  }

  return name;
}
