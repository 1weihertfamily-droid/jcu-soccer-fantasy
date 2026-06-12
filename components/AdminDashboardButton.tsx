"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
//<ArrowLeft className="h-5 w-5" />
import { ArrowLeftCircle } from "lucide-react";
//<ArrowLeftCircle className="h-5 w-5" />
import { ChevronLeft } from "lucide-react";
//<ChevronLeft className="h-5 w-5" />
import { LayoutDashboard } from "lucide-react";
//<LayoutDashboard className="h-5 w-5" />

export default function AdminDashboardButton() {
  return (
    <Link
      href="/admin"
      className="
        inline-flex items-center gap-2
        bg-blue-600 hover:bg-blue-700
        text-white
        px-4 py-2
        rounded-lg
        transition
      "
    >
      <LayoutDashboard className="h-5 w-5" />
      Admin Dashboard
    </Link>
  );
}