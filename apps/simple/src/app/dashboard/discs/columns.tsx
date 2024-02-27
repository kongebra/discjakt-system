import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DiscDto } from "./api";
import { Badge } from "@/components/ui/badge";

const columnHelper = createColumnHelper<DiscDto>();

export const columns = [
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("manufacturer.name", {
    header: "Manufacturer",
  }),
  columnHelper.accessor("speed", {
    header: "Speed",
  }),
  columnHelper.accessor("glide", {
    header: "Glide",
  }),
  columnHelper.accessor("turn", {
    header: "Turn",
  }),
  columnHelper.accessor("fade", {
    header: "Fade",
  }),
  columnHelper.accessor("approvedDate", {
    header: "Approved",
    cell: (info) => {
      const date = info.getValue();
      return new Date(date).toISOString().split("T")[0];
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
] satisfies ColumnDef<DiscDto, any>[];

