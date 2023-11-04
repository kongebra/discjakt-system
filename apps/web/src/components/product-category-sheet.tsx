import { Product, prisma } from "database";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import React from "react";
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
import { Button } from "./ui/button";

type Props = {
  product: Product;
};

const ProductCategorySheet: React.FC<Props> = ({ product }) => {
  async function handleSubmit(formData: FormData) {
    "use server";
    const category = formData.get("category") as Product["category"];

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        category,
      },
    });

    revalidatePath("/");
  }

  return (
    <Sheet key={new Date().getTime()}>
      <SheetTrigger asChild>
        <Button type="button">Sett kateogry</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-8">
          <SheetTitle>Sett kategori</SheetTitle>
          <SheetDescription>{product.name}</SheetDescription>

          {product?.image_url && (
            <Image
              unoptimized
              src={product.image_url}
              alt={product.name}
              width={512}
              height={512}
              className="border rounded-md"
            />
          )}
        </SheetHeader>

        <form action={handleSubmit}>
          <RadioGroup name="category" defaultValue="OTHER" className="mb-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="BAG" id="BAG" />
              <Label htmlFor="BAG">BAG</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ACCESSORY" id="ACCESSORY" />
              <Label htmlFor="ACCESSORY">ACCESSORY</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="APPAREL" id="APPAREL" />
              <Label htmlFor="APPAREL">APPAREL</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="EQUIPMENT" id="EQUIPMENT" />
              <Label htmlFor="EQUIPMENT">EQUIPMENT</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="BASKET" id="BASKET" />
              <Label htmlFor="BASKET">BASKET</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="OTHER" id="OTHER" />
              <Label htmlFor="OTHER">OTHER</Label>
            </div>
          </RadioGroup>

          <Button type="submit">Submit</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ProductCategorySheet;
