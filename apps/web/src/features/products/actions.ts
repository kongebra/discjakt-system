"use server";

import { updateProduct } from "@/lib/server";
import { revalidatePath } from "next/cache";

export async function setProductDisc(productId: string, discSlug: string) {
  "use server";

  await updateProduct({
    where: {
      id: productId,
    },
    data: {
      category: "DISC",
      disc: {
        connect: {
          slug: discSlug,
        },
      },
    },
  });

  revalidatePath("/");
}
