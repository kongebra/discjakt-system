import Section from "@/components/section";
import Title from "@/components/title";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DiscSheet } from "@/features/discs";
import { getDiscs, getManufacturers } from "@/lib/server";
import { Disc, Manufacturer } from "database";
import Image from "next/image";

export default async function Discs() {
  const [discs, manufactuerers] = await Promise.all([
    getDiscs({
      include: {
        manufacturer: true,
        _count: {
          select: { Product: true },
        },
      },
    }) as Promise<
      (Disc & {
        manufacturer: Manufacturer;
        _count: { Product: number };
      })[]
    >,
    getManufacturers(),
  ]);

  return (
    <>
      <Section>
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <Title>Data - Discs</Title>

              <DiscSheet manufactuerers={manufactuerers} />
            </div>
          </CardHeader>

          <CardContent>
            <Table className="mt-5">
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Navn</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Discer</TableHead>
                  <TableHead>Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discs
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((disc) => (
                    <TableRow key={disc.slug}>
                      <TableCell>
                        {!!disc.image_url && (
                          <Image
                            unoptimized
                            src={disc.image_url}
                            alt={disc.name}
                            width={64}
                            height={64}
                            className="rounded"
                          />
                        )}
                      </TableCell>
                      <TableCell>{disc.name}</TableCell>
                      <TableCell>{disc.slug}</TableCell>
                      <TableCell>{disc._count.Product}</TableCell>
                      <TableCell>
                        <DiscSheet
                          manufactuerers={manufactuerers}
                          buttonVariant="secondary"
                          variant="update"
                          disc={disc}
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
