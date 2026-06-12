"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ScoringRule = {
  id: number;
  action: string;
  value: number;
};

export default function ScoringPage() {
  const [rules, setRules] = useState<ScoringRule[]>([]);

  useEffect(() => {
    async function loadRules() {
      const res = await fetch(
        "/api/admin/scoring"
      );

      const data = await res.json();

      setRules(data ?? []);
    }

    loadRules();
  }, []);

  async function saveRules() {
    const res = await fetch(
      "/api/admin/scoring/save",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          scoring: rules,
        }),
      }
    );

    const result =
      await res.json();

    if (!res.ok) {
      alert(
        `Save Failed: ${result.error}`
      );
      return;
    }

    alert(
      "Fantasy Points Updated!"
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold">
            Fantasy Point Values
          </h1>

          <Link
            href="/admin"
            className="
              bg-blue-600
              hover:bg-blue-800
              px-4 py-2
              rounded
            "
          >
            ← Back Dashboard
          </Link>
        </div>

        <div className="bg-zinc-900 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left p-4">
                  Action
                </th>

                <th className="text-center p-4">
                  Fantasy Points
                </th>
              </tr>
            </thead>

            <tbody>
              {rules.map((rule) => (
                <tr
                  key={rule.id}
                  className="border-b border-zinc-800"
                >
                  <td className="p-4">
                    {rule.action}
                  </td>

                  <td className="p-4 text-center">
                    <input
                      type="number"
                      step="0.5"
                      value={rule.value}
                      onChange={(e) =>
                        setRules(
                          rules.map((r) =>
                            r.id === rule.id
                              ? {
                                  ...r,
                                  value:
                                    Number(
                                      e.target
                                        .value
                                    ),
                                }
                              : r
                          )
                        )
                      }
                      className="
                        w-24
                        p-2
                        rounded
                        bg-zinc-800
                        border
                        border-zinc-700
                        text-center
                      "
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={saveRules}
          className="
            mt-8
            bg-red-600
            hover:bg-red-700
            px-6 py-3
            rounded
            font-bold
          "
        >
          Save Fantasy Values
        </button>
      </div>
    </main>
  );
}