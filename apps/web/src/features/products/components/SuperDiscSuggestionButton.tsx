"use client";

import { Button } from "@/components/ui/button";
import React, { useTransition } from "react";
import { setProductDisc, superSetProductDisc } from "../actions";
import { Disc, Product } from "database";

type Props = {
  data: { product: Product; disc: Disc }[];
  disabled?: boolean;
};

export default function SuperDiscSuggestionButton({ data, disabled }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={() => {
        startTransition(() => {
          superSetProductDisc(
            data.map((item) => ({
              productId: item.product.id,
              discSlug: item.disc.slug,
            }))
          );
        });
      }}
      loading={isPending}
      disabled={disabled}
    >
      SUPER BUTTON
    </Button>
  );
}
