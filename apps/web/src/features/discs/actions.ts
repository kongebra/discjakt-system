"use server";

import { revalidatePath } from "next/cache";
import { DiscFields } from "./schemas";
import { createDisc, updateDisc } from "@/lib/server";

export async function createDiscAction(prevState: any, record: DiscFields) {
  "use server";

  const disc = await createDisc({
    data: {
      name: record.name,
      slug: record.slug,
      description: record.description,
      image_url: record.image_url,

      speed: record.speed,
      glide: record.glide,
      turn: record.turn,
      fade: record.fade,

      type: record.type,

      manufacturer: {
        connect: {
          slug: record.manufacturer_slug,
        },
      },
    },
  });
  console.log("createDiscAction", disc);

  revalidatePath("/");
}

export async function updateDiscAction(
  prevState: any,
  { slug, record }: { slug: string; record: DiscFields }
) {
  "use server";

  await updateDisc({
    where: {
      slug: slug,
    },
    data: {
      name: record.name,
      slug: record.slug,
      description: record.description,
      image_url: record.image_url,

      speed: record.speed,
      glide: record.glide,
      turn: record.turn,
      fade: record.fade,

      type: record.type,

      manufacturer: {
        connect: {
          slug: record.manufacturer_slug,
        },
      },
    },
  });

  revalidatePath("/");
}
