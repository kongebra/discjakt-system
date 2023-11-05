"use server";

import { updateManyProducts, updateProduct } from "@/lib/server";
import { Product } from "database";
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

export async function superSetProductDisc(
  data: {
    productId: string;
    discSlug: string;
  }[]
) {
  "use server";

  await Promise.all(
    data.map(({ productId, discSlug }) =>
      updateProduct({
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
      })
    )
  );

  revalidatePath("/");
}

export async function setProductsBagCategory(products: Product[]) {
  "use server";

  const ids = products.map((product) => product.id);

  await updateManyProducts({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      category: "BAG",
    },
  });

  revalidatePath("/");
}
