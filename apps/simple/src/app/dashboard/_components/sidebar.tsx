import { cn } from "@/lib/utils";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import SidebarNavItem from "./sidebar-nav-item";

const mainNavigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "home",
  },
  {
    title: "Manufacturers",
    href: "/dashboard/manufacturers",
    icon: "brand",
  },
  {
    title: "Discs",
    href: "/dashboard/discs",
    icon: "disc",
  },
];

export default function Sidebar() {
  return (
    <div className="lg:w-72 lg:flex lg:z-50 lg:flex-col lg:inset-y-0 lg:fixed hidden">
      <div className="px-6 bg-white border-r border-gray-200 overflow-y-auto gap-y-5 flex flex-col flex-grow">
        <div className="flex items-center h-20 flex-shrink-0">
          <span className="font-bold text-xl text-indigo-500">Discjakt</span>
        </div>

        <nav className="flex flex-col flex-1">
          <ul role="list" className="flex flex-col gap-y-5 flex-1">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {mainNavigation.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                  />
                ))}
              </ul>
            </li>
            <li></li>
            <li className="mt-auto -mx-6"></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

