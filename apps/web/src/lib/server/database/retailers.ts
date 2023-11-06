import { Prisma, prisma } from "database";

export async function getRetailers(args?: Prisma.RetailerFindManyArgs) {
  return prisma.retailer.findMany(args);
}

export async function updateRetailer(args: Prisma.RetailerUpdateArgs) {
  return prisma.retailer.update(args);
}

export async function updateManyRetailers(args: Prisma.RetailerUpdateManyArgs) {
  return prisma.retailer.updateMany(args);
}
