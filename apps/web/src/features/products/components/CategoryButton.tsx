"use client";

import { Button } from "@/components/ui/button";
import { Product } from "database";
import React, { useTransition } from "react";
import { setProductCategory } from "../actions";

type Props = {
  product: Product;
  category: Product["category"];
};

const CategoryButton: React.FC<Props> = ({ product, category }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      loading={isPending}
      onClick={() => {
        startTransition(() => {
          setProductCategory(product.id, category);
        });
      }}
    >
      {category}
    </Button>
  );
};

export default CategoryButton;
