import { Prisma, prisma } from "database";

export async function getProducts(args?: Prisma.ProductFindManyArgs) {
  return prisma.product.findMany(args);
}
