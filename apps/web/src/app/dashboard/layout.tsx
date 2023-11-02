import DashboardSidebar from "@/components/dashboard-sidebar";
import Section from "@/components/section";
import { type Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s - Dashboard",
  },
};

export default function DashboardLayout({
  children,
}: React.PropsWithChildren<{}>) {
  return (
    <div>
      <DashboardSidebar />

      <div className="lg:pl-72">
        <Section className="sm:gap-x-6 gap-x-4 items-center flex flex-shrink-0 h-16 z-40 top-0 sticky shadow-sm bg-white border-b border-gray-200">
          <div className="lg:gap-x-6 gap-x-4 flex-1 self-stretch flex">
            <div className="flex-1"></div>

            <div className="lg:gap-x-6 gap-x-4 items-center flex">
              <p>Logged in as: {"none"}</p>
            </div>
          </div>
        </Section>

        <main className="py-10">{children}</main>
      </div>
    </div>
  );
}
