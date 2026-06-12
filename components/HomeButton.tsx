"use client";

import Link from "next/link";
import { House } from "lucide-react";

export default function HomeButton() {
  return (
    <Link
      href="/"
      className="
        inline-flex items-center gap-2
        bg-blue-600 hover:bg-blue-700
        text-white
        px-4 py-2
        rounded-lg
        transition
      "
    >
      <House className="h-5 w-5" />
      Home
    </Link>
  );
}