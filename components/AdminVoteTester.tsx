"use client";

import { useMemo, useState } from "react";
import VoteForm from "@/components/VoteForm";
import AdminVoteList from "@/components/AdminVoteList";

type Game = {
  id: number;
  name: string;
};

type Player = {
  id: number;
  name: string;
};

type Props = {
  games: Game[];
  players: Player[];
  awardCounts: {
    goat: Map<number, number>;
    hardest_worker: Map<number, number>;
    unstoppable_defense: Map<number, number>;
  };
  awardLimits: {
    [key: string]: number;
  };
};

export default function AdminVoteTester({
  games,
  players,
  awardCounts,
  awardLimits,
}: Props) {
  const [selectedGameId, setSelectedGameId] =
    useState<number | null>(games?.[0]?.id ?? null);

  const selectedGame = useMemo(
    () =>
      games.find((game) => game.id === selectedGameId) ||
      games[0] ||
      null,
    [games, selectedGameId]
  );

  if (!selectedGame) {
    return (
      <div className="bg-zinc-900 rounded-xl p-6 text-zinc-300">
        No active games are available for voting.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {games.length > 1 && (
        <div className="bg-zinc-900 rounded-xl p-6">
          <label className="block mb-2 font-semibold text-white">
            Select game to test
          </label>
          <select
            value={selectedGameId ?? ""}
            onChange={(e) =>
              setSelectedGameId(Number(e.target.value))
            }
            className="w-full max-w-md rounded bg-zinc-800 border border-zinc-700 p-3"
          >
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-zinc-900 rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Test Ballot for {selectedGame.name}
        </h2>
        <VoteForm
          gameId={selectedGame.id}
          players={players}
          awardCounts={awardCounts}
          awardLimits={awardLimits}
          adminMode
        />
      </div>

      <div className="bg-zinc-900 rounded-xl p-6">
        <AdminVoteList
          gameId={selectedGame.id}
          players={players}
        />
      </div>
    </div>
  );
}
