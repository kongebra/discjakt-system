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
import { Manufacturer } from "database";
import React, { useState, useTransition } from "react";
import ManufacturerForm from "../forms/manufacturer-form";
import { createManufacturerAction, updateManufacturerAction } from "..";
import { useFormState } from "react-dom";

type Props = {
  buttonVariant?: ButtonProps["variant"];
} & (
  | {
      variant?: "create";
      manufacturer?: undefined;
    }
  | {
      variant: "update";
      manufacturer: Manufacturer;
    }
);

const ManufacturerSheet: React.FC<Props> = ({
  buttonVariant,
  manufacturer,
  variant = "create",
}) => {
  const [open, setOpen] = useState(false);

  const [createState, createDispatch] = useFormState(
    createManufacturerAction,
    {}
  );
  const [updateState, updateDispatch] = useFormState(
    updateManufacturerAction,
    {}
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={buttonVariant}>
          {variant === "create" ? "Create Manufacturer" : "Update Manufacturer"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-4">
          <SheetTitle>
            {variant === "create"
              ? "Create Manufacturer"
              : "Update Manufacturer"}
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <ManufacturerForm
          defaultValues={variant === "update" ? manufacturer : undefined}
          loading={false}
          onSubmit={(data) => {
            if (variant === "update") {
              if (!manufacturer) {
                throw new Error("Manufacturer is undefined");
              }

              updateDispatch({
                slug: manufacturer.slug,
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

export default ManufacturerSheet;
