"use client";

import { useEffect, useState } from "react";

type Player = {
  id: number;
  name: string;
};

type VoteRecord = {
  ballotId: number;
  voterName: string;
  createdAt: string;
  goatVotes: number[];
  hardestWorkerVotes: number[];
  unstoppableDefenseVotes: number[];
};

type Props = {
  gameId: number;
  players: Player[];
};

export default function AdminVoteList({ gameId, players }: Props) {
  const [votes, setVotes] = useState<VoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const playerName = (playerId: number) =>
    players.find((player) => player.id === playerId)?.name || "Unknown player";

  const loadVotes = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/votes?gameId=${gameId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load votes.");
      }

      setVotes(data.votes ?? []);
    } catch (err: any) {
      setError(err?.message || "Failed to load votes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVotes();
  }, [gameId]);

  const handleResetVote = async (ballotId: number) => {
    if (!confirm("Reset this ballot so the parent can vote again?")) {
      return;
    }

    setDeletingId(ballotId);

    try {
      const res = await fetch("/api/admin/votes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ballotId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset vote.");
      }

      await loadVotes();
    } catch (err: any) {
      setError(err?.message || "Failed to reset vote.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Parent Ballots</h2>
          <p className="text-sm text-zinc-400">
            See each submitted parent ballot for this game and reset individual records if needed.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-zinc-400">Loading ballots...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : votes.length === 0 ? (
        <div className="text-zinc-400">No parent ballots have been submitted for this game.</div>
      ) : (
        <div className="space-y-4">
          {votes.map((vote) => (
            <div
              key={vote.ballotId}
              className="rounded-xl border border-zinc-700 bg-zinc-950 p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{vote.voterName || "Anonymous parent"}</p>
                  <p className="text-sm text-zinc-500">
                    Submitted {new Date(vote.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleResetVote(vote.ballotId)}
                  disabled={deletingId === vote.ballotId}
                  className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deletingId === vote.ballotId ? "Resetting…" : "Reset vote"}
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-zinc-400 uppercase tracking-wide">GOAT</p>
                  <ul className="mt-2 space-y-1 text-sm text-white">
                    {vote.goatVotes.map((playerId, index) => (
                      <li key={`goat-${index}`}>{playerName(playerId)}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-zinc-400 uppercase tracking-wide">Hardest Worker</p>
                  <ul className="mt-2 space-y-1 text-sm text-white">
                    {vote.hardestWorkerVotes.map((playerId, index) => (
                      <li key={`worker-${index}`}>{playerName(playerId)}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-zinc-400 uppercase tracking-wide">Unstoppable Defense</p>
                  <ul className="mt-2 space-y-1 text-sm text-white">
                    {vote.unstoppableDefenseVotes.map((playerId, index) => (
                      <li key={`defense-${index}`}>{playerName(playerId)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
