"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminBackButton from "@/components/AdminBackButton";
import AdminDashboardButton from "@/components/AdminDashboardButton";

type Player = {
  id: number;
  name: string;
  active: boolean;
  season_id: number | null;
};

type Season = {
  id: number;
  name: string;
  active: boolean;
};

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [seasons, setSeasons] =
  useState<Season[]>([]);

  const [selectedSeason, setSelectedSeason] =
  useState<number | null>(null);
  const [newPlayer, setNewPlayer] = useState("");

  async function loadSeasons() {
    const res = await fetch("/api/admin/seasons");

    const data = await res.json();

    setSeasons(data);

    const activeSeason =
      data.find((s: Season) => s.active);

    if (activeSeason) {
      setSelectedSeason(activeSeason.id);
    }
  }

  async function loadPlayers() {
  if (!selectedSeason) return;

  const res = await fetch(
    `/api/admin/players?seasonId=${selectedSeason}`
  );

  if (!res.ok) {
    alert("Failed to load players");
    return;
  }

  const data = await res.json();
  setPlayers(data);
}

  useEffect(() => {
  loadSeasons();
  }, []);

  useEffect(() => {
    if (selectedSeason !== null) {
      loadPlayers();
    }
  }, [selectedSeason]);

const filteredPlayers =
  selectedSeason === null
    ? players
    : players.filter(
        (player) =>
          player.season_id === selectedSeason
      );

  async function addPlayer() {
    if (!newPlayer.trim()) return;

    const res = await fetch(
      "/api/admin/players",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name: newPlayer,
          season_id: selectedSeason,
        }),
      }
    );

    if (!res.ok) {
      alert("Failed to add player");
      return;
    }

    setNewPlayer("");
    loadPlayers();
  }

  async function updatePlayer(
    id: number,
    updates: Partial<Player>
  ) {
    const res = await fetch(
      "/api/admin/players",
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          id,
          ...updates,
        }),
      }
    );

    if (!res.ok) {
      alert("Failed to update player");
      return;
    }

    loadPlayers();
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">
            Manage Players
          </h1>

          <AdminDashboardButton />
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold mb-4">
            Add Player
          </h2>

        <div className="mb-6">
          <label className="block mb-2 text-sm text-zinc-400">
            Season
          </label>

          <select
            value={selectedSeason ?? ""}
            onChange={(e) =>
              setSelectedSeason(Number(e.target.value))
            }
            className="
              bg-zinc-800
              border border-zinc-700
              rounded
              p-3
              w-full
              max-w-sm
            "
          >
            {seasons.map((season) => (
              <option
                key={season.id}
                value={season.id}
              >
                {season.name}
              </option>
            ))}
          </select>
        </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={newPlayer}
              onChange={(e) =>
                setNewPlayer(e.target.value)
              }
              placeholder="Player Name"
              className="flex-1 p-3 rounded bg-zinc-800 border border-zinc-700"
            />

            <button
              onClick={addPlayer}
              className="
                bg-green-600 hover:bg-green-700
                px-5 py-3 rounded font-semibold
                w-full sm:w-auto
              "
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left p-4">
                  Name
                </th>

                <th className="text-center p-4">
                  Active
                </th>

                <th className="text-center p-4">
                  Profile
                </th>

                <th className="text-center p-4">
                  Save
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPlayers.map((player) => (
                <tr
                  key={player.id}
                  className="border-b border-zinc-800"
                >
                  <td className="p-4">
                    <input
                      value={player.name}
                      onChange={(e) =>
                        setPlayers((current) =>
                          current.map((p) =>
                            p.id === player.id
                              ? {
                                  ...p,
                                  name: e.target.value,
                                }
                              : p
                          )
                        )
                      }
                      className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
                    />
                  </td>

                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={player.active}
                      onChange={(e) =>
                        setPlayers((current) =>
                          current.map((p) =>
                            p.id === player.id
                              ? {
                                  ...p,
                                  active:
                                    e.target.checked,
                                }
                              : p
                          )
                        )
                      }
                    />
                  </td>

                  <td className="text-center">
                    <Link
                      href={`/players/${player.id}`}
                      target="_blank"
                      className="
                        inline-block
                        bg-blue-600 hover:bg-blue-700
                        px-4 py-2 rounded
                        font-semibold
                      "
                    >
                      Open
                    </Link>
                  </td>

                  <td className="text-center">
                    <button
                      onClick={() =>
                        updatePlayer(
                          player.id,
                          {
                            name: player.name,
                            active: player.active,
                          }
                        )
                      }
                      className="
                        bg-red-600 hover:bg-red-700
                        px-4 py-2 rounded
                      "
                    >
                      Save
                    </button>
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