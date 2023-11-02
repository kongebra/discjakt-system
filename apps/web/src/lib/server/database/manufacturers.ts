import { Prisma, prisma } from "database";

export async function getManufacturers(args?: Prisma.ManufacturerFindManyArgs) {
  return prisma.manufacturer.findMany(args);
}

export async function createManufacturer(data: Prisma.ManufacturerCreateInput) {
  return prisma.manufacturer.create({ data });
}
