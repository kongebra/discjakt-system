import ProductCategorySheet from "@/components/product-category-sheet";
import Section from "@/components/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DiscSheet } from "@/features/discs";
import { DiscSuggestionButton } from "@/features/products";
import SuperBagCategoryButton from "@/features/products/components/SuperBagCategoryButton";
import { slugify } from "@/lib";
import { getProducts } from "@/lib/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function BagCategorize() {
  const [products] = await Promise.all([
    getProducts({
      where: {
        category: {
          equals: "NOT_SET",
        },
        OR: [
          {
            name: {
              contains: "bag",
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: "backpack",
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: "sack",
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: "sekk",
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <>
      <Section>
        <Card>
          <CardHeader>
            <CardTitle>Tasks - Bags - Categorize</CardTitle>

            <SuperBagCategoryButton products={products} />
          </CardHeader>

          <CardContent>
            <Table className="mt-5">
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: "8rem" }}>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
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
                    <TableCell>
                      <Link href={product.url} target="_blank">
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <ProductCategorySheet product={product} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Section>
    </>
  );
}
