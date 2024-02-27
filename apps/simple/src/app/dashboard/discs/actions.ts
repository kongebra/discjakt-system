"use server";

import { prisma } from "@discjakt/db";
import { revalidatePath } from "next/cache";

export async function toggleDiscActiveAction(id: string, active: boolean) {
  await prisma.disc.update({
    where: { id },
    data: { active },
  });

  revalidatePath("/dashboard/discs");
}

export async function cleanupAction() {
  const manufacturers = await prisma.manufacturer.findMany({
    where: {
      active: false,
    },
  });

  await prisma.disc.updateMany({
    where: {
      manufacturerSlug: {
        in: manufacturers.map((m) => m.slug),
      },
    },
    data: {
      active: false,
    },
  });

  revalidatePath("/dashboard/discs");
}

