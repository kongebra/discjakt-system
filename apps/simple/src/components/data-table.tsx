"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Checkbox } from "./ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";

type DataTableSelectFilter = {
  type: "select";
  columnId: string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

type DataTableTextFilter = {
  type: "text";
  columnId: string;
  placeholder?: string;
};

export type DataTableFilter = DataTableSelectFilter | DataTableTextFilter;

type DataTableSeparatorAction = {
  type: "separator";
};

type DataTableButtonAction<TData extends object> = {
  type: "button";
  label: React.ReactNode;
  shortcut?: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>, data: TData) => void;
};

type DataTableRadioAction<TData extends object> = {
  type: "radio";
  label: React.ReactNode;
  options: {
    value: string;
    label: React.ReactNode;
  }[];
  onChange: (e: React.FormEvent<HTMLDivElement>, data: TData) => void;
  defaultValue: string;
};

export type DataTableAction<TData extends object> =
  | DataTableSeparatorAction
  | DataTableButtonAction<TData>
  | DataTableRadioAction<TData>;

interface DataTableProps<TData extends object, TValue = any> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];

  filters?: DataTableFilter[];
  rowActions?: DataTableAction<TData>[];

  disableSelection?: boolean;
}

export function DataTable<TData extends object, TValue = any>({
  data,
  columns,

  filters,
  rowActions,

  disableSelection = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const _columns = useMemo(() => {
    const result = [...columns];

    if (!disableSelection) {
      result.unshift({
        id: "_selection",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    if (rowActions && rowActions.length > 0) {
      result.push({
        id: "_actions",
        cell: ({ row }) => (
          <DataTableRowActions row={row} rowActions={rowActions} />
        ),
      });
    }

    return result;
  }, [columns, disableSelection, rowActions]);

  const table = useReactTable({
    data,
    columns: _columns,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} filters={filters} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <Button
                          variant="ghost"
                          onClick={() =>
                            header.column.toggleSorting(
                              header.column.getIsSorted() === "asc",
                            )
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getIsSorted() === false ? (
                            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                          ) : header.column.getIsSorted() === "asc" ? (
                            <ArrowUpIcon className="ml-2 h-4 w-4" />
                          ) : (
                            <ArrowDownIcon className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} disableSelection={disableSelection} />
    </div>
  );
}

