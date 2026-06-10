"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Game = {
  id: number;
  name: string;
  active: boolean;
  voting_open: boolean;
  display_order: number;
};

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [newGame, setNewGame] = useState("");

  async function loadGames() {
    const res = await fetch("/api/admin/games");

    if (!res.ok) {
      alert("Failed to load games");
      return;
    }

    const data = await res.json();
    setGames(data);
  }

  useEffect(() => {
    loadGames();
  }, []);

  async function addGame() {
    if (!newGame.trim()) return;

    const res = await fetch(
      "/api/admin/games",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
        name: newGame,
        display_order:
          games.length + 1,
      }),
      }
    );

    if (!res.ok) {
      alert("Failed to add game");
      return;
    }

    setNewGame("");
    loadGames();
  }

  async function updateGame(
    id: number,
    updates: Partial<Game>
  ) {
    const res = await fetch(
      "/api/admin/games",
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
      alert("Failed to update game");
      return;
    }

    loadGames();
  }

  async function saveAllGames() {
  const response = await fetch(
    "/api/admin/games/save-all",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        games,
      }),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    alert(
      `Save failed: ${result.error}`
    );
    return;
  }

  alert("All games saved!");

  loadGames();
}

async function resetVoting(gameId: number) {
  const confirmed = confirm(
    "Delete all ballots and votes for this game?"
  );

  if (!confirmed) return;

  const response = await fetch(
    "/api/admin/games/reset-voting",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    alert(`Reset failed: ${result.error}`);
    return;
  }

  alert("Voting successfully reset.");
}

async function clearGameStats(gameId: number) {
  const confirmed = confirm(
    "Delete ALL player stats for this game?"
  );

  if (!confirmed) return;

  const response = await fetch(
    "/api/admin/games/reset-stats",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    alert(`Reset failed: ${result.error}`);
    return;
  }

  alert("Game stats successfully cleared.");
}
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">
            Manage Games
          </h1>

          <Link
            href="/admin"
            className="
              bg-blue-600 hover:bg-blue-800
              px-4 py-2 rounded
              text-center
              w-full sm:w-auto
            "
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold mb-4">
            Add Game
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={newGame}
              onChange={(e) =>
                setNewGame(e.target.value)
              }
              placeholder="Game Name"
              className="flex-1 p-3 rounded bg-zinc-800 border border-zinc-700"
            />

            <button
              onClick={addGame}
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
                
                <th className="text-center p-4">
                  Order
                </th>

                <th className="text-left p-4">
                  Name
                </th>

                <th className="text-center p-4">
                  Active
                </th>

                <th className="text-center p-4">
                  Voting Open
                </th>

                <th className="text-center p-4">
                    Voting
                </th>

                <th className="text-center p-4">
                    Stats
                </th>
              </tr>
            </thead>

            <tbody>
              {games.map((game) => (
                <tr
                  key={game.id}
                  className="border-b border-zinc-800"
                >
                  <td className="p-4">
                    <input
                      type="number"
                      value={game.display_order}
                      onChange={(e) =>
                        setGames((current) =>
                          current.map((g) =>
                            g.id === game.id
                              ? {
                                  ...g,
                                  display_order:
                                    Number(
                                      e.target.value
                                    ) || 0,
                                }
                              : g
                          )
                        )
                      }
                      className="w-20 p-2 rounded bg-zinc-800 border border-zinc-700 text-center"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      value={game.name}
                      onChange={(e) =>
                        setGames((current) =>
                          current.map((g) =>
                            g.id === game.id
                              ? {
                                  ...g,
                                  name: e.target.value,
                                }
                              : g
                          )
                        )
                      }
                      className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
                    />
                  </td>

                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={game.active}
                      onChange={(e) =>
                        setGames((current) =>
                          current.map((g) =>
                            g.id === game.id
                              ? {
                                  ...g,
                                  active:
                                    e.target.checked,
                                }
                              : g
                          )
                        )
                      }
                    />
                  </td>

                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={
                        game.voting_open
                      }
                      onChange={(e) =>
                        setGames((current) =>
                          current.map((g) =>
                            g.id === game.id
                              ? {
                                  ...g,
                                  voting_open:
                                    e.target.checked,
                                }
                              : g
                          )
                        )
                      }
                    />
                  </td>

                    <td className="text-center p-2">
                      <button
                        onClick={() => resetVoting(game.id)}
                        className="
                          bg-red-600 hover:bg-red-700
                          px-3 py-2 rounded
                          text-sm font-semibold
                          w-full
                          whitespace-normal
                          leading-tight
                        "
                      >
                        Reset Voting
                      </button>
                    </td>

                    <td className="text-center p-2">
                      <button
                        onClick={() => clearGameStats(game.id)}
                        className="
                          bg-orange-600 hover:bg-orange-700
                          px-3 py-2 rounded
                          text-sm font-semibold
                          w-full
                          whitespace-normal
                          leading-tight
                        "
                      >
                        Clear Stats
                      </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end">
  <button
    onClick={saveAllGames}
    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-bold"
  >
    Save All Changes
  </button>
</div>
      </div>
    </main>
  );
}