"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toggleManufacturerActiveStatus } from "./actions";
import { ManufacturerWithCount } from "./api";

const columnHelper = createColumnHelper<ManufacturerWithCount>();

export const columns = [
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("slug", {
    header: "Slug",
  }),
  columnHelper.accessor("_count.discs", {
    header: "Discs",
  }),
  columnHelper.accessor("_count.plastics", {
    header: "Plastics",
  }),
  columnHelper.accessor("discs", {
    header: "Last disc approved",
    cell: (info) => {
      const discs = info.getValue();
      if (discs.length) {
        return new Date(discs[0].approvedDate).toISOString().split("T")[0];
      }

      return "";
    },
    sortingFn: ({ original: a }, { original: b }) => {
      const aDate = a.discs.length ? new Date(a.discs[0].approvedDate) : 0;
      const bDate = b.discs.length ? new Date(b.discs[0].approvedDate) : 0;

      if (aDate < bDate) {
        return -1;
      }

      if (aDate > bDate) {
        return 1;
      }

      return 0;
    },
  }),
  columnHelper.accessor((row) => (row.active ? "true" : "false"), {
    id: "active",
    header: "Active",
    cell: (info) => {
      const active = info.row.original.active;

      return (
        <Badge variant={active ? "success" : "destructive"}>
          {active ? "Active" : "Inactive"}
        </Badge>
      );
    },
    filterFn: (row, columnId, filterValue: string[]) => {
      const value = row.original.active ? "true" : "false";
      return filterValue.includes(value);
    },
  }),
  // columnHelper.display({
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const manufacturer = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(manufacturer.id)}
  //           >
  //             Copy manufacturer ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem
  //             onClick={async () => {
  //               await toggleManufacturerActiveStatus(
  //                 manufacturer.id,
  //                 !manufacturer.active,
  //               );
  //             }}
  //           >
  //             {manufacturer.active ? "Deactivate" : "Activate"}
  //           </DropdownMenuItem>
  //           {/* <DropdownMenuItem
  //             onClick={async () => {
  //               await deleteManufacturer(manufacturer.id);
  //             }}
  //           >
  //             Delete
  //           </DropdownMenuItem> */}
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // }),
] satisfies ColumnDef<ManufacturerWithCount, any>[];

