"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type AwardPlayer = {
  playerName: string;
  playerId: string;
  votes: number;
};

type AwardGame = {
  gameId: string;
  goat: AwardPlayer[];
  hardestWorker: AwardPlayer[];
  defense: AwardPlayer[];
};

export default function AwardsPage() {
  const [games, setGames] =
    useState<AwardGame[]>([]);

const [selectedGame, setSelectedGame] =
  useState("all");

const [selectedPlayer, setSelectedPlayer] =
  useState("all");

const [selectedCategory, setSelectedCategory] =
  useState("all");

  useEffect(() => {
    async function loadAwards() {
      const res = await fetch("/api/awards");
      const data = await res.json();
      setGames(data);
    }

    loadAwards();
  }, []);

  const players = useMemo(() => {
    const unique = new Map();

    games.forEach((game) => {
      [
        ...game.goat,
        ...game.hardestWorker,
        ...game.defense,
      ].forEach((player) => {
        unique.set(
          player.playerId,
          player.playerName
        );
      });
    });

    return Array.from(unique.entries())
      .map(([id, name]) => ({
        id,
        name,
      }))
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  }, [games]);

const filteredGames = useMemo(() => {
  let results = [...games];

  // Game Filter
  if (selectedGame !== "all") {
    results = results.filter(
      (game) =>
        String(game.gameId) === selectedGame
    );
  }

  // Player Filter
  if (selectedPlayer !== "all") {
    results = results.filter((game) => {
      return (
        game.goat.some(
          (p) =>
            String(p.playerId) ===
            selectedPlayer
        ) ||
        game.hardestWorker.some(
          (p) =>
            String(p.playerId) ===
            selectedPlayer
        ) ||
        game.defense.some(
          (p) =>
            String(p.playerId) ===
            selectedPlayer
        )
      );
    });
  }

  return results;
}, [
  games,
  selectedGame,
  selectedPlayer,
]);

  function renderPlayer(
    player:
      | AwardPlayer
      | undefined
  ) {
    if (!player) return "-";

const highlighted =
  selectedPlayer !== "all" &&
  String(player.playerId) === selectedPlayer;

    return (
      <>
        <Link
          href={`/players/${player.playerId}`}
          className={`hover:text-blue-400 hover:underline ${
            highlighted
              ? "text-yellow-400 font-bold"
              : ""
          }`}
        >
          {player.playerName}
        </Link>

        {" "}
        ({player.votes})

        {highlighted && (
          <span className="ml-2">
            ⭐
          </span>
        )}
      </>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold">
            Awards Results
          </h1>

          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Filters */}

        <div className="bg-zinc-900 rounded-xl p-5 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Game
              </label>

              <select
                value={selectedGame}
                onChange={(e) =>
                  setSelectedGame(
                    e.target.value
                  )
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-3"
              >
                <option value="all">
                  All Games
                </option>

                {games.map((game) => (
                  <option
                    key={game.gameId}
                    value={String(game.gameId)}
                  >
                    Game {game.gameId}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Player
              </label>

              <select
                value={selectedPlayer}
                onChange={(e) =>
                  setSelectedPlayer(
                    e.target.value
                  )
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-3"
              >
                <option value="all">
                  All Players
                </option>

                {players.map((player) => (
                  <option
                    key={player.id}
                    value={player.id}
                  >
                    {player.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Category
              </label>

              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value
                  )
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-3"
              >
                <option value="all">
                  All Categories
                </option>

                <option value="goat">
                  GOAT
                </option>

                <option value="worker">
                  Hardest Worker
                </option>

                <option value="defense">
                  Unstoppable Defense
                </option>
              </select>
            </div>
          </div>
        </div>

        {filteredGames.map((game) => (
          <div
            key={game.gameId}
            className="mb-10 bg-zinc-900 rounded-xl overflow-hidden"
          >
            <div className="bg-zinc-800 px-6 py-4">
              <h2 className="text-2xl font-bold">
                Game {game.gameId}
              </h2>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left p-4">
                    Rank
                  </th>

                  {(selectedCategory ===
                    "all" ||
                    selectedCategory ===
                      "goat") && (
                    <th className="text-left p-4">
                      🏆 GOAT
                    </th>
                  )}

                  {(selectedCategory ===
                    "all" ||
                    selectedCategory ===
                      "worker") && (
                    <th className="text-left p-4">
                      🔥 Hardest Worker
                    </th>
                  )}

                  {(selectedCategory ===
                    "all" ||
                    selectedCategory ===
                      "defense") && (
                    <th className="text-left p-4">
                      🛡️ Defense
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {[0, 1, 2, 3, 4].map(
                  (index) => (
                    <tr
                      key={index}
                      className="border-b border-zinc-800"
                    >
                      <td className="p-4 font-bold">
                        #{index + 1}
                      </td>

                      {(selectedCategory ===
                        "all" ||
                        selectedCategory ===
                          "goat") && (
                        <td className="p-4">
                          {renderPlayer(
                            game.goat[index]
                          )}
                        </td>
                      )}

                      {(selectedCategory ===
                        "all" ||
                        selectedCategory ===
                          "worker") && (
                        <td className="p-4">
                          {renderPlayer(
                            game
                              .hardestWorker[
                              index
                            ]
                          )}
                        </td>
                      )}

                      {(selectedCategory ===
                        "all" ||
                        selectedCategory ===
                          "defense") && (
                        <td className="p-4">
                          {renderPlayer(
                            game.defense[
                              index
                            ]
                          )}
                        </td>
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ))}

        <div className="mb-6">
          <Link
            href="/admin/player-profiles"
            className="inline-block bg-zinc-600 hover:bg-red-600 px-4 py-2 rounded"
          >
            ← Back to Admin - Player Preview
          </Link>
        </div>
      </div>
    </main>
  );
}