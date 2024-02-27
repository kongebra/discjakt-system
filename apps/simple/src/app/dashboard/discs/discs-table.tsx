"use client";

import { DataTable } from "@/components/data-table";
import React from "react";
import { toggleDiscActiveAction } from "./actions";
import { DiscDto } from "./api";
import { columns } from "./columns";

type Props = {
  data: DiscDto[];
};

const DiscsTable: React.FC<Props> = ({ data }) => {
  //   const [isPending, startTransition] = useTransition();

  return (
    <>
      {/* <Button
        type="button"
        className="mb-4"
        onClick={() => {
          startTransition(async () => {
            await cleanupAction();
          });
        }}
      >
        {isPending ? "Cleaning up..." : "Cleanup"}
      </Button> */}

      <DataTable
        data={data}
        columns={columns}
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
            label: "Activate/Deactivate",
            onClick: async (e, data) => {
              await toggleDiscActiveAction(data.id, !data.active);
            },
          },
        ]}
      />
    </>
  );
};

export default DiscsTable;

