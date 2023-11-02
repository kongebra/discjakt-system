import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "@tremor/react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { object, string, number, date, InferType } from "yup";
import { Manufacturer } from "database";
import { createManufacturer } from "@/lib/server";
import { revalidatePath } from "next/cache";

// name: string;
// slug: string;
// description: string | null;
// image_url: string | null;

const schema = object({
  name: string().required(),
  slug: string().required(),
  description: string().nullable(),
  image_url: string().nullable(),
});

const CreateManufacturerSheet = () => {
  async function handleSubmit(formData: FormData) {
    "use server";

    const manufacturer = await schema.validate({
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      image_url: formData.get("image_url"),
    });

    await createManufacturer(manufacturer);

    revalidatePath("/");
  }

  return (
    <Sheet key={new Date().getTime()}>
      <SheetTrigger asChild>
        <Button>Lag produsent</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-4">
          <SheetTitle>Lag produsent</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <form action={handleSubmit}>
          <div className="grid w-full items-center gap-2 mb-4">
            <Label htmlFor="name">Navn</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Enter name..."
            />
          </div>

          <div className="grid w-full items-center gap-2 mb-4">
            <Label htmlFor="slug">Slug</Label>
            <Input
              type="text"
              name="slug"
              id="slug"
              placeholder="Enter slug..."
            />
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateManufacturerSheet;
