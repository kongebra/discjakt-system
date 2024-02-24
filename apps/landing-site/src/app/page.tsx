import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { signUpEmailAction } from "./actions";
import LaunchSignUpForm from "@/components/launch-sign-up-form";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-10 md:py-24 lg:py-32 xl:py-36 dark:bg-slate-900 dark:text-white">
      <div className="container flex flex-col items-center gap-4 text-center md:gap-10">
        <div className="space-y-3">
          {/* <img
            alt="Discjakt"
            className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
            height="90"
            src="/placeholder.svg"
            width="180"
          /> */}
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Discjakt is coming soon!
          </h1>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            The ultimate disc golf experience. Explore, share, and connect with
            disc golf enthusiasts across the globe.
          </p>
        </div>
        <div className="w-full max-w-sm space-y-2">
          <LaunchSignUpForm />
        </div>
        {/* <div className="flex items-center justify-center gap-4 mt-4">
          <Link
            className="rounded-full inline-flex w-10 h-10 items-center justify-center border border-gray-200 border-gray-200 bg-white shadow-sm text-gray-900 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
            href="#"
          >
            <TwitterIcon className="w-5 h-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link
            className="rounded-full inline-flex w-10 h-10 items-center justify-center border border-gray-200 border-gray-200 bg-white shadow-sm text-gray-900 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
            href="#"
          >
            <FacebookIcon className="w-5 h-5" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link
            className="rounded-full inline-flex w-10 h-10 items-center justify-center border border-gray-200 border-gray-200 bg-white shadow-sm text-gray-900 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
            href="#"
          >
            <InstagramIcon className="w-5 h-5" />
            <span className="sr-only">Instagram</span>
          </Link>
        </div> */}
      </div>
    </div>
  );
}

