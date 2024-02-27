"use server";

import { prisma } from "@discjakt/db";
import { revalidatePath } from "next/cache";

export async function toggleManufacturerActiveStatus(
  manufacturerId: string,
  isActive: boolean,
) {
  await prisma.manufacturer.update({
    where: {
      id: manufacturerId,
    },
    data: {
      active: isActive,
    },
  });

  revalidatePath("/dashboard/manufacturers");
}

export async function deleteManufacturer(manufacturerId: string) {
  await prisma.manufacturer.delete({
    where: {
      id: manufacturerId,
    },
  });

  revalidatePath("/dashboard/manufacturers");
}

