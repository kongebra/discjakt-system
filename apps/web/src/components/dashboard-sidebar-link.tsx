"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = React.PropsWithChildren<{
  href: string;
  icon?: React.FC<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>>>;
}>;

const DashboardSidebarLink: React.FC<Props> = ({
  children,
  href,
  icon: Icon,
}) => {
  const pathname = usePathname();
  const isCurrentPath = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "p-2 rounded-md text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white flex -mx-2 gap-x-3",
        {
          "bg-gray-800 text-white": isCurrentPath,
        }
      )}
    >
      {Icon && <Icon className="w-6 h-6 flex-shrink-0" />}
      {children}
    </Link>
  );
};

export default DashboardSidebarLink;
