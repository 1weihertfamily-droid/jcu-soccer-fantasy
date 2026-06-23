"use client";

import { useEffect, useState } from "react";
import { getVisitorId } from "@/lib/visitor";

export default function WelcomePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted =
      localStorage.getItem(
        "jcu-welcome-accepted"
      );

    if (!accepted) {
      setShow(true);
    }
  }, []);

  async function handleContinue() {
    const visitorId = getVisitorId();

    await fetch("/api/track-visitor", {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        visitorId,
        userAgent:
          navigator.userAgent,
        screenWidth:
          window.innerWidth,
        screenHeight:
          window.innerHeight,
        page:
          window.location.pathname,
      }),
    });

    localStorage.setItem(
      "jcu-welcome-accepted",
      "true"
    );

    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-xl p-8 max-w-md text-center">
        <h2 className="text-3xl font-bold mb-4">
          ⚽ Welcome!
        </h2>

        <p className="text-zinc-300 mb-6">
          Ready to enter the JCU Fantasy
          Soccer experience?
        </p>

        <button
          onClick={handleContinue}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold"
        >
          Enter Site
        </button>
      </div>
    </div>
  );
}