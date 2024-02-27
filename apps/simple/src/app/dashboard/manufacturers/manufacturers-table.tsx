"use client";

import React from "react";
import { ManufacturerWithCount } from "./api";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { toggleManufacturerActiveStatus } from "./actions";

type Props = {
  data: ManufacturerWithCount[];
};

const ManufacturersTable: React.FC<Props> = ({ data }) => {
  return (
    <DataTable
      data={data}
      columns={columns}
      disableSelection
      filters={[
        {
          type: "text",
          columnId: "name",
          placeholder: "Filter by name...",
        },
        {
          type: "select",
          columnId: "active",
          options: [
            {
              label: "Active",
              value: "true",
            },
            {
              label: "Inactive",
              value: "false",
            },
          ],
          title: "Filter Active",
        },
      ]}
      rowActions={[
        {
          type: "button",
          label: "Copy ID",
          onClick: (e, data) => {
            navigator.clipboard.writeText(data.id);
          },
        },
        {
          type: "separator",
        },
        {
          type: "button",
          label: "Activate/Deactivate",
          onClick: async (e, data) => {
            await toggleManufacturerActiveStatus(data.id, !data.active);
          },
        },
      ]}
    />
  );
};

export default ManufacturersTable;

