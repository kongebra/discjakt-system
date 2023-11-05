"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Disc, Product } from "database";
import React, { useTransition } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib";
import { setProductDisc } from "../actions";

export default function SelectDiscSheet({
  product,
  discs,
}: {
  product: Product;
  discs: Disc[];
}) {
  const [isPending, startTransition] = useTransition();

  const [sheetOpen, setSheetOpen] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const data = discs.map((disc) => ({
    value: `${disc.slug}|${disc.manufacturer_slug}`,
    label: `${disc.name} (${disc.manufacturer_slug})`,
  }));

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button>Select Disc</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-8">
          <SheetTitle>Sett kategori</SheetTitle>
          <SheetDescription>{product.name}</SheetDescription>
        </SheetHeader>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between mb-4"
            >
              {value
                ? data.find((disc) => disc.value === value)?.label
                : "Select disc..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command
              filter={(value, search) => {
                if (value.includes(search)) return 1;
                return 0;
              }}
            >
              <CommandInput placeholder="Search discs..." />
              <CommandEmpty>No disc found.</CommandEmpty>
              <CommandGroup>
                {data.map((disc) => (
                  <CommandItem
                    key={disc.value}
                    value={disc.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === disc.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {disc.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          onClick={() => {
            startTransition(() => {
              const [disc_slug, manufacturer_slug] = value.split("|");
              setProductDisc(product.id, disc_slug).then(() => {
                setSheetOpen(false);
              });
            });
          }}
          loading={isPending}
        >
          Save
        </Button>
      </SheetContent>
    </Sheet>
  );
}
