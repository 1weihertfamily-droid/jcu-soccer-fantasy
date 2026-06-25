"use client";

import { useEffect, useState } from "react";
import AdminDashboardButton from "@/components/AdminDashboardButton";

type Season = {
  id: number;
  name: string;
  active: boolean;
};

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [newSeason, setNewSeason] = useState("");

  async function loadSeasons() {
    const res = await fetch("/api/admin/seasons");

    const data = await res.json();

    setSeasons(data);
  }

  useEffect(() => {
    loadSeasons();
  }, []);

  async function createSeason() {
    if (!newSeason.trim()) return;

    await fetch("/api/admin/seasons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newSeason,
      }),
    });

    setNewSeason("");

    loadSeasons();
  }

  async function activateSeason(
    seasonId: number
  ) {
    await fetch("/api/admin/seasons", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seasonId,
      }),
    });

    loadSeasons();
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">
            Manage Seasons
          </h1>

          <AdminDashboardButton />
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold mb-4">
            Create Season
          </h2>

          <div className="flex gap-3">
            <input
              value={newSeason}
              onChange={(e) =>
                setNewSeason(e.target.value)
              }
              placeholder="Spring 2027"
              className="flex-1 p-3 rounded bg-zinc-800 border border-zinc-700"
            />

            <button
              onClick={createSeason}
              className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded"
            >
              Create
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left p-4">
                  Season
                </th>

                <th className="text-center p-4">
                  Active
                </th>

                <th className="text-center p-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {seasons.map((season) => (
                <tr
                  key={season.id}
                  className="border-b border-zinc-800"
                >
                  <td className="p-4">
                    {season.name}
                  </td>

                  <td className="text-center">
                    {season.active
                      ? "✅"
                      : ""}
                  </td>

                  <td className="text-center">
                    {!season.active && (
                      <button
                        onClick={() =>
                          activateSeason(
                            season.id
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                      >
                        Make Active
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </main>
  );
}