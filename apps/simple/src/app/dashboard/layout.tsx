import Navbar from "@/app/(app)/_components/navbar";
import type { Metadata } from "next";
import Sidebar from "./_components/sidebar";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard",
  },
  description: "",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* // TODO: mobile menu */}
      <div className="lg:hidden sm:px-6 shadow-sm py-4 px-4 bg-white gap-x-6 flex items-center z-40 top-0 sticky"></div>

      <main className="lg:pl-72 py-10">
        <div className="lg:px-8 sm:px-6 px-4">{children}</div>
      </main>
    </div>
  );
}

