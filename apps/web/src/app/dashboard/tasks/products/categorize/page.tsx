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
import { slugify } from "@/lib";
import { getDiscs, getManufacturers, getProducts } from "@/lib/server";
import Image from "next/image";
import { getProductDiscSuggestions } from "suggestor";

export default async function TasksProductsCategorize() {
  const [products, discs, manufacturers] = await Promise.all([
    getProducts({
      where: {
        category: {
          equals: "NOT_SET",
        },
      },
      take: 64,
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

  return (
    <>
      <Section>
        <Card>
          <CardHeader>
            <CardTitle>Tasks - Products - Categorize</CardTitle>
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
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      {suggestions.map((disc) => (
                        <Button key={`${product.id}_${disc.id}`} type="button">
                          {disc.name}
                        </Button>
                      ))}
                    </TableCell>
                    <TableCell>
                      <ProductCategorySheet product={product} />
                    </TableCell>
                    <TableCell>
                      <DiscSheet
                        manufactuerers={manufacturers}
                        disc={{
                          name: product.name,
                          slug: slugify(product.name),
                          image_url: product.image_url,
                          description: product.description,
                        }}
                      />
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
