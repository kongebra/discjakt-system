import ProductCategorySheet from "@/components/product-category-sheet";
import Section from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DiscSheet } from "@/features/discs";
import { DiscSuggestionButton } from "@/features/products";
import CategoryButton from "@/features/products/components/CategoryButton";
import SelectDiscSheet from "@/features/products/components/SelectDiscSheet";
import SuperDiscSuggestionButton from "@/features/products/components/SuperDiscSuggestionButton";
import { slugify } from "@/lib";
import { getDiscs, getManufacturers, getProducts } from "@/lib/server";
import { Product } from "database";
import Image from "next/image";
import Link from "next/link";
import { getProductDiscSuggestions } from "suggestor";

export default async function TasksProductsCategorize() {
  const [products, discs, manufacturers] = await Promise.all([
    getProducts({
      where: {
        category: {
          equals: "NOT_SET",
        },
      },
      take: 128,
    }),
    getDiscs(),
    getManufacturers(),
  ]);

  const discSlugs = discs.map((disc) => disc.slug);

  const data = products.map((product) => {
    const slugs = getProductDiscSuggestions(product.name, discSlugs);
    const suggestions = discs.filter((disc) => slugs.includes(disc.slug));

    return {
      product,
      suggestions,
    };
  });

  const allHaveOneSuggestion = data.every(
    ({ suggestions }) => suggestions.length === 1
  );

  return (
    <>
      <Section>
        <Card>
          <CardHeader>
            <CardTitle>Tasks - Products - Categorize</CardTitle>

            <SuperDiscSuggestionButton
              data={data.map((item) => ({
                product: item.product,
                disc: item.suggestions[0],
              }))}
              disabled={!allHaveOneSuggestion}
            />
          </CardHeader>

          <CardContent>
            <Table className="mt-5">
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: "8rem" }}>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Suggestions</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Disc</TableHead>
                </TableRow>
              </TableHeader>
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
                    <TableCell>
                      <Link href={product.url} target="_blank">
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {suggestions.map((disc) => (
                        <DiscSuggestionButton
                          key={`${product.id}_${disc.id}`}
                          product={product}
                          disc={disc}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {(
                          [
                            "ACCESSORY",
                            "APPAREL",
                            "BAG",
                            "BASKET",
                            "OTHER",
                          ] as Product["category"][]
                        ).map((category) => (
                          <CategoryButton
                            key={category}
                            product={product}
                            category={category}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <DiscSheet
                          manufactuerers={manufacturers}
                          disc={{
                            name: product.name,
                            slug: slugify(product.name),
                            image_url: product.image_url,
                            description: product.description,
                          }}
                        />
                        <SelectDiscSheet product={product} discs={discs} />
                      </div>
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
