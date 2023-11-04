"use server";

import { createManufacturer, updateManufacturer } from "@/lib/server";
import { ManufacturerFields } from ".";
import { revalidatePath } from "next/cache";

export async function createManufacturerAction(
  prevState: any,
  record: ManufacturerFields
) {
  "use server";

  await createManufacturer({
    data: {
      name: record.name,
      slug: record.slug,
      description: record.description,
      image_url: record.image_url,
    },
  });

  revalidatePath("/");
}

export async function updateManufacturerAction(
  prevState: any,
  { slug, record }: { slug: string; record: ManufacturerFields }
) {
  "use server";

  await updateManufacturer({
    where: {
      slug: slug,
    },
    data: {
      name: record.name,
      slug: record.slug,
      description: record.description,
      image_url: record.image_url,
    },
  });

  revalidatePath("/");
}
