import { prisma, Prisma } from "@discjakt/db";

const args = Prisma.validator<Prisma.DiscDefaultArgs>()({
  include: {
    manufacturer: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
  },
});

export type DiscDto = Prisma.DiscGetPayload<typeof args>;

export async function getDiscs() {
  return await prisma.disc.findMany(args);
}

