import CreateManufacturerSheet from "@/components/create-manufacturer-sheet";
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
import { ManufacturerSheet } from "@/features/manufacturer";
import { getManufacturers } from "@/lib/server";
import { Manufacturer } from "database";
import Image from "next/image";
import React from "react";

export default async function Manufacturers() {
  const [manufacturers] = await Promise.all([
    getManufacturers({
      include: {
        _count: {
          select: { discs: true },
        },
      },
    }) as Promise<(Manufacturer & { _count: { discs: number } })[]>,
  ]);

  return (
    <>
      <Section>
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <Title>Data - Produsenter</Title>

              <ManufacturerSheet />
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
                {manufacturers
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((manufacturer) => (
                    <TableRow key={manufacturer.slug}>
                      <TableCell>
                        {!!manufacturer.image_url && (
                          <Image
                            unoptimized
                            src={manufacturer.image_url}
                            alt={manufacturer.name}
                            width={64}
                            height={64}
                            className="rounded"
                          />
                        )}
                      </TableCell>
                      <TableCell>{manufacturer.name}</TableCell>
                      <TableCell>{manufacturer.slug}</TableCell>
                      <TableCell>{manufacturer._count.discs}</TableCell>
                      <TableCell>
                        <ManufacturerSheet
                          buttonVariant="secondary"
                          variant="update"
                          manufacturer={manufacturer}
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
