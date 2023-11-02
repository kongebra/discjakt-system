import CreateManufacturerSheet from "@/components/create-manufacturer-sheet";
import Section from "@/components/section";
import { getManufacturers } from "@/lib/server";
import {
  Card,
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from "@tremor/react";
import { Manufacturer } from "database";
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
          <div className="flex justify-between items-center">
            <Title>Data - Produsenter</Title>

            <CreateManufacturerSheet />
          </div>

          <Table className="mt-5">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Navn</TableHeaderCell>
                <TableHeaderCell>Discer</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {manufacturers.map((manufacturer) => (
                <TableRow key={manufacturer.slug}>
                  <TableHeaderCell>{manufacturer.name}</TableHeaderCell>
                  <TableHeaderCell>{manufacturer._count.discs}</TableHeaderCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Section>
    </>
  );
}
