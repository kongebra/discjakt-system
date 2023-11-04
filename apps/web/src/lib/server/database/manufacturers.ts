import { Prisma, prisma } from "database";

export async function getManufacturers(args?: Prisma.ManufacturerFindManyArgs) {
  return prisma.manufacturer.findMany(args);
}

export async function createManufacturer(args: Prisma.ManufacturerCreateArgs) {
  return prisma.manufacturer.create(args);
}

export async function updateManufacturer(args: Prisma.ManufacturerUpdateArgs) {
  return prisma.manufacturer.update(args);
}
