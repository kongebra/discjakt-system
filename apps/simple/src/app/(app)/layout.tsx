import Navbar from "@/app/(app)/_components/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Discjakt",
    template: "%s | Discjakt",
  },
  description: "",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>
        <Navbar />
      </header>

      {children}

      <footer></footer>
    </>
  );
}

