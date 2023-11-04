import { Prisma, prisma } from "database";

export async function getDisc(args: Prisma.DiscFindUniqueArgs) {
  return await prisma.disc.findUnique(args);
}

export async function getDiscs(args?: Prisma.DiscFindManyArgs) {
  return await prisma.disc.findMany(args);
}

export async function createDisc(args: Prisma.DiscCreateArgs) {
  return await prisma.disc.create(args);
}

export async function updateDisc(args: Prisma.DiscUpdateArgs) {
  return await prisma.disc.update(args);
}
