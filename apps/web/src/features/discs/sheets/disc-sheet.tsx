"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Disc, Manufacturer } from "database";
import React, { useState } from "react";
import { useFormState } from "react-dom";
import { DiscForm } from "..";
import { createDiscAction, updateDiscAction } from "../actions";

type Props = {
  manufactuerers: Manufacturer[];
  buttonVariant?: ButtonProps["variant"];
} & (
  | {
      variant?: "create";
      disc?: Partial<Disc>;
    }
  | {
      variant: "update";
      disc: Disc;
    }
);

const DiscSheet: React.FC<Props> = ({
  manufactuerers,
  buttonVariant,
  variant = "create",
  disc,
}) => {
  const [open, setOpen] = useState(false);

  const [createState, createDispatch] = useFormState(createDiscAction, {});
  const [updateState, updateDispatch] = useFormState(updateDiscAction, {});

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={buttonVariant}>
          {variant === "create" ? "Create Disc" : "Update Disc"}
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[512px]">
        <SheetHeader className="mb-4">
          <SheetTitle>
            {variant === "create" ? "Create Disc" : "Update Disc"}
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <DiscForm
          manufacturers={manufactuerers}
          defaultValues={disc}
          loading={false}
          onSubmit={(data) => {
            if (variant === "update") {
              if (!disc) {
                throw new Error("disc is undefined");
              }

              if (!disc.slug) {
                throw new Error("disc.slug is undefined");
              }

              updateDispatch({
                slug: disc.slug,
                record: data,
              });
              setOpen(false);
            } else {
              createDispatch(data);
              setOpen(false);
            }
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default DiscSheet;
