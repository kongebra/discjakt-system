import CreateDiscSheet from "@/components/create-disc-sheet";
import ProductCategorySheet from "@/components/product-category-sheet";
import ProductCategoryButton from "@/components/product-category-sheet";
import Section from "@/components/section";
import { getProductDiscSuggestions } from "@/lib";
import { getDiscs, getManufacturers, getProducts } from "@/lib/server";
import {
  Button,
  Card,
  Color,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import { ProductCategory } from "database";
import Image from "next/image";
import React from "react";

export default async function TasksProductsCategorize() {
  const [products, discs, manufacturers] = await Promise.all([
    getProducts({
      where: {
        category: {
          equals: "NOT_SET",
        },
      },
      take: 16,
    }),
    getDiscs(),
    getManufacturers(),
  ]);

  const data = products.map((product) => {
    return {
      product,
      suggestions: getProductDiscSuggestions(product, discs),
    };
  });

  return (
    <>
      <Section>
        <Card>
          <Title>Tasks - Products - Categorize</Title>

          <Table className="mt-5">
            <TableHead>
              <TableRow>
                <TableHeaderCell style={{ width: "8rem" }}>
                  Image
                </TableHeaderCell>
                <TableHeaderCell>Title</TableHeaderCell>
                <TableHeaderCell>Suggestions</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
                <TableHeaderCell>Disc</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(({ product, suggestions }) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image
                      unoptimized
                      src={product.image_url || "https://placehold.co/400"}
                      alt={product.name}
                      width={128}
                      height={128}
                      className="max-w-full h-auto"
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {suggestions.map((disc) => (
                      <Button
                        key={`${product.id}_${disc.id}`}
                        type="button"
                        formAction={async () => {
                          "use server";
                          console.log("foo");
                        }}
                      >
                        {disc.slug.toUpperCase()}
                      </Button>
                    ))}
                  </TableCell>
                  <TableCell>
                    <ProductCategorySheet product={product} />
                  </TableCell>
                  <TableCell>
                    <CreateDiscSheet
                      product={product}
                      manufacturers={manufacturers}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Section>
    </>
  );
}
