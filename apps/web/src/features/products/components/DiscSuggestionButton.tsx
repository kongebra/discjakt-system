"use client";

import { Button } from "@/components/ui/button";
import React, { useTransition } from "react";
import { setProductDisc } from "../actions";
import { Disc, Product } from "database";

type Props = {
  product: Product;
  disc: Disc;
};

export default function DiscSuggestionButton({ product, disc }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => {
        startTransition(() => {
          setProductDisc(product.id, disc.slug);
        });
      }}
      loading={isPending}
    >
      {disc.name}
    </Button>
  );
}
