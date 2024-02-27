"use client";

import { cn } from "@/lib/utils";
import { Building2Icon, DiscIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  title: string;
  href: string;
  icon: string;
};

const iconsTypeToComponent = (icon: string) => {
  switch (icon) {
    case "brand":
      return Building2Icon;
    case "disc":
      return DiscIcon;
    case "home":
    default:
      return HomeIcon;
  }
};

const SidebarNavItem: React.FC<Props> = ({ title, href, icon }) => {
  const pathname = usePathname();
  const Icon = iconsTypeToComponent(icon);
  const isActive = pathname === href;

  return (
    <li key={href}>
      <Link
        href={href}
        className={cn(
          "leading-6 font-semibold text-sm p-2 rounded-md gap-x-3 flex group",
          {
            "text-indigo-800 bg-gray-50": isActive,
            "text-gray-700 hover:text-indigo-800 hover:bg-gray-50": !isActive,
          },
        )}
      >
        <Icon
          className={cn("w-6 h-6 flex-shrink-0", {
            "text-indigo-600": isActive,
            "text-gray-400 group-hover:text-indigo-600": !isActive,
          })}
        />
        <span>{title}</span>
      </Link>
    </li>
  );
};

export default SidebarNavItem;

