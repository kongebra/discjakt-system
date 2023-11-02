import { slugify } from "@/lib";
import { Button } from "@tremor/react";
import { Manufacturer, Product } from "database";
import Image from "next/image";
import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = {
  product?: Product;
  manufacturers: Manufacturer[];
};

// manufacturer_slug: string;

const CreateDiscSheet: React.FC<Props> = ({ product, manufacturers }) => {
  async function createDisc(formData: FormData) {
    "use server";

    console.log({ formData });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" color="green">
          Create disc
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create disc</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <form action={createDisc}>
          <input
            type="hidden"
            name="image_url"
            value={product?.image_url || ""}
          />

          {product?.image_url && (
            <Image
              unoptimized
              src={product.image_url}
              alt={product.name}
              width={512}
              height={512}
              className="border rounded-md mb-4"
            />
          )}

          <div className="grid w-full items-center gap-2 mb-4">
            <Label htmlFor="name">Navn</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Enter name..."
              defaultValue={product?.name}
            />
          </div>

          <div className="grid w-full items-center gap-2 mb-4">
            <Label htmlFor="slug">Slug</Label>
            <Input
              type="text"
              name="slug"
              id="slug"
              placeholder="Enter slug..."
              defaultValue={slugify(product?.name || "")}
            />
          </div>

          <div className="grid w-full items-center gap-2 mb-4">
            <Label htmlFor="manufacturer">Produsent</Label>
            <Select name="manufacturer">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Produsent" />
              </SelectTrigger>
              <SelectContent>
                {manufacturers.map((manufacturer) => (
                  <SelectItem key={manufacturer.id} value={manufacturer.slug}>
                    {manufacturer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center gap-2 mb-4">
            <Label htmlFor="type">Type</Label>
            <RadioGroup name="type" defaultValue="PUTTER" className="mb-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PUTTER" id="PUTTER" />
                <Label htmlFor="PUTTER">PUTTER</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MIDRANGE" id="MIDRANGE" />
                <Label htmlFor="MIDRANGE">MIDRANGE</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FAIRWAY" id="FAIRWAY" />
                <Label htmlFor="FAIRWAY">FAIRWAY</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DISTANCE" id="DISTANCE" />
                <Label htmlFor="DISTANCE">DISTANCE</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid w-full items-center gap-2 mb-4">
            <div className="grid grid-cols-4 gap-2">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="speed">Speed</Label>
                <Input type="number" name="speed" id="speed" min={0} max={15} />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="glide">Glide</Label>
                <Input type="number" name="glide" id="glide" min={0} max={7} />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="turn">Turn</Label>
                <Input type="number" name="turn" id="turn" min={-5} max={2} />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="fade">Fade</Label>
                <Input type="number" name="fade" id="fade" min={0} max={5} />
              </div>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateDiscSheet;
