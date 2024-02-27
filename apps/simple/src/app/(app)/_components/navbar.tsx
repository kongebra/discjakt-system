import { prisma } from "@discjakt/db";
import NavbarDesktopMenu from "./navbar-desktop-menu";

export default async function Navbar() {
  const manufacturerData = await prisma.manufacturer.findMany({
    where: {
      active: true,
    },
    select: {
      name: true,
      slug: true,
      _count: {
        select: {
          discs: {
            where: {
              active: true,
            },
          },
        },
      },
    },
  });

  const manufacturers = manufacturerData
    .sort((a, b) => b._count.discs - a._count.discs)
    .slice(0, 12)
    .map((manufacturer) => ({
      name: manufacturer.name,
      href: manufacturer.slug,
      description: `${manufacturer._count.discs} discs`,
    }));

  return (
    <header>
      <nav className="bg-white shadow">
        <div className="sm:px-6 px-4 max-w-7xl mx-auto">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <div className="flex flex-shrink-0 items-center">
                <span className="font-bold text-xl text-indigo-500">
                  Discjakt
                </span>
              </div>

              <div className="hidden sm:flex sm:ml-6 sm:space-x-8">
                <NavbarDesktopMenu manufacturers={manufacturers} />
              </div>
            </div>

            <div className="sm:flex hidden sm:items-center sm:ml-6"></div>

            <div className="flex items-center -mr-2 sm:hidden"></div>
          </div>
        </div>
      </nav>
    </header>
  );
}

