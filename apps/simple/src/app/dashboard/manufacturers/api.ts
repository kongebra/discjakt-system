import { prisma, Prisma } from "@discjakt/db";

const manufacturerArgs = Prisma.validator<Prisma.ManufacturerDefaultArgs>()({
  include: {
    _count: {
      select: {
        discs: true,
        plastics: true,
      },
    },
    discs: {
      take: 1,
      orderBy: {
        approvedDate: "desc",
      },
    },
  },
});

export type ManufacturerWithCount = Prisma.ManufacturerGetPayload<
  typeof manufacturerArgs
>;

export async function getManufacturers() {
  return await prisma.manufacturer.findMany(manufacturerArgs);
}

