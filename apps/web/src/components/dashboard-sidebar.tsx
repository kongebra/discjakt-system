"use client";

import Image from "next/image";
import DashboardSidebarLink from "./dashboard-sidebar-link";
import {
  HomeIcon,
  Cog6ToothIcon,
  TagIcon,
  Bars3Icon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

const DashboardSidebar = () => {
  return (
    <div className="lg:flex lg:flex-col lg:w-72 lg:z-50 lg:inset-y-0 lg:fixed hidden">
      <div className="pb-4 px-6 bg-gray-700 overflow-y gap-y-5 flex flex-col flex-grow">
        <div className="flex h-16 items-center flex-shrink-0">
          <Image
            unoptimized
            width={32}
            height={32}
            className="w-auto h-8"
            src="https://tailwindui.com/img/logos/mark.svg?color=white"
            alt="Your Company"
          />
        </div>
        <nav className="flex flex-col flex-1">
          <ul role="list" className="flex flex-col gap-y-5 flex-1">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                <li>
                  <DashboardSidebarLink href="/dashboard" icon={HomeIcon}>
                    Dashboard
                  </DashboardSidebarLink>
                </li>
                <li></li>
              </ul>
            </li>

            <li>
              <div className="text-gray-400 leading-6 font-semibold text-xs">
                Data
              </div>
              <ul role="list" className="-mx-2 space-y-1 mt-2">
                <li>
                  <DashboardSidebarLink
                    href="/dashboard/data/products"
                    icon={DocumentIcon}
                  >
                    Produkter
                  </DashboardSidebarLink>
                </li>
                <li>
                  <DashboardSidebarLink
                    href="/dashboard/data/discs"
                    icon={DocumentIcon}
                  >
                    Disker
                  </DashboardSidebarLink>
                </li>
                <li>
                  <DashboardSidebarLink
                    href="/dashboard/data/plastics"
                    icon={DocumentIcon}
                  >
                    Plastikk
                  </DashboardSidebarLink>
                </li>
                <li>
                  <DashboardSidebarLink
                    href="/dashboard/data/manufacturers"
                    icon={DocumentIcon}
                  >
                    Produsenter
                  </DashboardSidebarLink>
                </li>
                <li>
                  <DashboardSidebarLink
                    href="/dashboard/data/retailers"
                    icon={DocumentIcon}
                  >
                    Butikker
                  </DashboardSidebarLink>
                </li>
              </ul>
            </li>

            <li>
              <div className="text-gray-400 leading-6 font-semibold text-xs">
                Oppgaver
              </div>
              <ul role="list" className="-mx-2 space-y-1 mt-2">
                <li>
                  <DashboardSidebarLink
                    href="/dashboard/tasks/products/categorize"
                    icon={TagIcon}
                  >
                    Produkt - Kategorisering
                  </DashboardSidebarLink>
                </li>
              </ul>
            </li>

            <li className="mt-auto">
              <DashboardSidebarLink
                href="/dashboard/settings"
                icon={Cog6ToothIcon}
              >
                Innstillinger
              </DashboardSidebarLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
