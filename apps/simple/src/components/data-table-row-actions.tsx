"use client";

import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { DataTableAction } from "./data-table";

interface DataTableRowActionsProps<TData extends object> {
  row: Row<TData>;
  rowActions: DataTableAction<TData>[];
}

export function DataTableRowActions<TData extends object>({
  row,
  rowActions,
}: DataTableRowActionsProps<TData>) {
  const data = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {rowActions?.map((action, index) => {
          if (action.type === "separator") {
            return <DropdownMenuSeparator key={index} />;
          }

          if (action.type === "button") {
            return (
              <DropdownMenuItem
                key={index}
                onClick={(e) => action.onClick(e, data)}
              >
                {action.label}
                {action.shortcut && (
                  <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            );
          }

          if (action.type === "radio") {
            return (
              <DropdownMenuSub key={index}>
                <DropdownMenuSubTrigger>{action.label}</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={action.defaultValue}
                    onChange={(e) => action.onChange(e, data)}
                  >
                    {action.options.map((option) => (
                      <DropdownMenuRadioItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            );
          }

          return null;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

