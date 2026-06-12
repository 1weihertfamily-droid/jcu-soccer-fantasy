"use client";

import { useRouter } from "next/navigation";

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
        bg-zinc-600
        hover:bg-red-800
        px-4 py-2
        rounded
      "
    >
      ← Back
    </button>
  );
}