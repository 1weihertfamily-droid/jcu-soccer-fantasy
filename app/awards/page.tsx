"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AwardPlayer = {
  playerName: string;
  playerId: string;
  votes: number;
};

type AwardGame = {
  gameId: string;

  goat: AwardPlayer[];

  hardestWorker:
    AwardPlayer[];

  defense: AwardPlayer[];
};

export default function AwardsPage() {
  const [games, setGames] =
    useState<AwardGame[]>([]);

  useEffect(() => {
    async function loadAwards() {
      const res = await fetch(
        "/api/awards"
      );

      const data =
        await res.json();

      setGames(data);
    }

    loadAwards();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold">
            Awards Results
          </h1>

          <Link
            href="/"
            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded"
          >
            ← Back to Home
          </Link>
        </div>

        {games.map((game) => (
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

                  <th className="text-left p-4">
                    🏆 GOAT
                  </th>

                  <th className="text-left p-4">
                    🔥 Hardest Worker
                  </th>

                  <th className="text-left p-4">
                    🛡️ Defense
                  </th>
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

                      <td className="p-4">
                        {game.goat[
                          index
                        ] ? (
                          <>
                            <Link
                                href={`/players/${game.goat[index].playerId}`}
                                className="hover:text-blue-400 hover:underline"
                            >
                                {game.goat[index].playerName}
                            </Link>
                            {" "}
                            ({game.goat[index].votes})
                            </>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="p-4">
                        {game
                          .hardestWorker[
                          index
                        ] ? (
                          <>
                            <Link
                                href={`/players/${game.hardestWorker[index].playerId}`}
                                className="hover:text-blue-400 hover:underline"
                            >
                                {game.hardestWorker[index].playerName}
                            </Link>
                            {" "}
                            ({game.hardestWorker[index].votes})
                            </>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="p-4">
                        {game
                          .defense[
                          index
                        ] ? (
                          <>
                            <Link
                                href={`/players/${game.defense[index].playerId}`}
                                className="hover:text-blue-400 hover:underline"
                            >
                                {game.defense[index].playerName}
                            </Link>
                            {" "}
                            ({game.defense[index].votes})
                            </>
                        ) : (
                          "-"
                        )}
                      </td>
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
                className="inline-block bg-red-500 hover:bg-zinc-600 px-4 py-2 rounded"
            >
                ← Back to Admin -Player Preview
            </Link>
        </div>
      
      </div>
    </main>
  );
}