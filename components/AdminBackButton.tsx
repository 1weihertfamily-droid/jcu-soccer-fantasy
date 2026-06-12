"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
//<ArrowLeft className="h-5 w-5" />
import { ArrowLeftCircle } from "lucide-react";
//<ArrowLeftCircle className="h-5 w-5" />
import { ChevronLeft } from "lucide-react";
//<ChevronLeft className="h-5 w-5" />
import { LayoutDashboard } from "lucide-react";
//<LayoutDashboard className="h-5 w-5" />

export default function AdminBackButton() {
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/admin");
    }
  }

  return (
    <button
      onClick={handleBack}
      className="
      inline-flex items-center gap-2  
      bg-zinc-600
        hover:bg-red-800
        px-4 py-2
        rounded
        transition
      "
    >
      <ArrowLeft className="h-5 w-5" /> 
      Back
    </button>
  );
}