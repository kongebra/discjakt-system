"use client";

import { Button } from "@/components/ui/button";
import { Product } from "database";
import { useTransition } from "react";
import { setProductsBagCategory } from "../actions";

type Props = {
  products: Product[];
};

export default function SuperBagCategoryButton({ products }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={() => {
        startTransition(() => {
          setProductsBagCategory(products);
        });
      }}
      loading={isPending}
    >
      SET ALL BAG CATEGORY
    </Button>
  );
}
