import { Prisma, prisma } from "database";

export async function getProducts(args?: Prisma.ProductFindManyArgs) {
  return prisma.product.findMany(args);
}

export async function updateProduct(args: Prisma.ProductUpdateArgs) {
  return prisma.product.update(args);
}

export async function updateManyProducts(args: Prisma.ProductUpdateManyArgs) {
  return prisma.product.updateMany(args);
}
