"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { XIcon } from "lucide-react";
import { DataTableFilter } from "./data-table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData extends object> {
  table: Table<TData>;
  filters?: DataTableFilter[];
}

export function DataTableToolbar<TData extends object>({
  table,
  filters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {filters?.map((filter) => {
          if (filter.type === "text") {
            return (
              <Input
                key={filter.columnId}
                placeholder={
                  filter.placeholder ?? `Filter ${filter.columnId}...`
                }
                value={
                  (table
                    .getColumn(filter.columnId)
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn(filter.columnId)
                    ?.setFilterValue(event.target.value)
                }
                className="h-8 w-[150px] lg:w-[250px]"
              />
            );
          }

          if (filter.type === "select") {
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={table.getColumn(filter.columnId)}
                title={filter.title}
                options={filter.options}
              />
            );
          }

          return null;
        })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}

