import { Prisma, prisma } from "database";

export async function getDiscs(args?: Prisma.DiscFindManyArgs) {
  return await prisma.disc.findMany(args);
}
