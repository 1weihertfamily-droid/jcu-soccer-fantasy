"use client";

import { useEffect, useState } from "react";
import { getVoterId } from "@/lib/voter";

type Player = {
  id: number;
  name: string;
};

type Props = {
  gameId: number;
  players: Player[];
  awardCounts: {
    goat: Map<number, number>;
    hardest_worker: Map<number, number>;
    unstoppable_defense: Map<number, number>;
  };
  awardLimits: {
    [key: string]: number;
  };
  adminMode?: boolean;
  initialAdminVoterId?: string;
};

export default function VoteForm({
  gameId,
  players,
  awardCounts,
  awardLimits,
  adminMode = false,
  initialAdminVoterId = "",
}: Props) {
  const [voterName, setVoterName] = useState("");
  const [adminVoterId, setAdminVoterId] =
    useState(initialAdminVoterId);
  const [goatVotes, setGoatVotes] = useState([
    "",
    "",
    "",
  ]);
  const [workerVotes, setWorkerVotes] = useState([
    "",
    "",
    "",
  ]);
  const [defenseVotes, setDefenseVotes] = useState([
    "",
    "",
    "",
  ]);
  const [alreadyVoted, setAlreadyVoted] =
    useState(false);
  const [voteLoaded, setVoteLoaded] =
    useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [overrideExisting, setOverrideExisting] =
    useState(false);

  const voterId = getVoterId();

  const normalizeVotes = (votes: any[]) =>
    Array.from({ length: 3 }, (_, index) =>
      String(votes?.[index] ?? "")
    );

  useEffect(() => {
    if (adminMode) {
      setAlreadyVoted(false);
      setVoteLoaded(true);
      return;
    }

    async function checkVote() {
      const res = await fetch(
        `/api/vote/check?gameId=${gameId}&voterId=${voterId}`
      );
      const data = await res.json();

      if (data.alreadyVoted) {
        setAlreadyVoted(true);
        setVoterName(data.voterName || "");
        setGoatVotes(normalizeVotes(data.goatVotes || []));
        setWorkerVotes(normalizeVotes(data.hardestWorkerVotes || []));
        setDefenseVotes(normalizeVotes(data.unstoppableDefenseVotes || []));
      }

      setVoteLoaded(true);
    }

    checkVote();
  }, [gameId, adminMode, voterId]);

  const allSelections = [
    ...goatVotes,
    ...workerVotes,
    ...defenseVotes,
  ].filter(Boolean);

  function getAvailablePlayers(
    currentValue: string,
    category:
      | "goat"
      | "hardest_worker"
      | "unstoppable_defense"
  ) {
    const max = awardLimits[category] ?? 999;

    return players.filter((player) => {
      const alreadySelected =
        String(player.id) === currentValue ||
        !allSelections.includes(String(player.id));

      const awardsEarned =
        awardCounts[category].get(player.id) ?? 0;

      const eligible =
        awardsEarned < max ||
        String(player.id) === currentValue;

      return alreadySelected && eligible;
    });
  }

  function hasDuplicates(votes: string[]) {
    const filled = votes.filter(Boolean);
    return new Set(filled).size !== filled.length;
  }

  async function handleSubmit() {
    if (!voterName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (
      goatVotes.some((v) => !v) ||
      workerVotes.some((v) => !v) ||
      defenseVotes.some((v) => !v)
    ) {
      alert("Please select 3 players in every category.");
      return;
    }

    const allSelectionsSet = new Set(allSelections);

    if (allSelectionsSet.size !== allSelections.length) {
      alert("Each player may only be selected once on the ballot.");
      return;
    }

    if (
      hasDuplicates(goatVotes) ||
      hasDuplicates(workerVotes) ||
      hasDuplicates(defenseVotes)
    ) {
      alert("Each player may only be selected once on the ballot.");
      return;
    }

    const voterIdToUse = adminMode
      ? adminVoterId || crypto.randomUUID()
      : voterId;

    if (adminMode && !adminVoterId) {
      setAdminVoterId(voterIdToUse);
    }

    const res = await fetch("/api/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId,
        voterId: voterIdToUse,
        voterName,
        forceOverride:
          adminMode
            ? overrideExisting
            : alreadyVoted,
        goatVotes: goatVotes.map(Number),
        hardestWorkerVotes: workerVotes.map(Number),
        unstoppableDefenseVotes: defenseVotes.map(Number),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to submit vote.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold text-green-400">
          Thank You For Voting!
        </h2>
        <p className="mt-4 text-zinc-400">
          Your ballot has been submitted.
        </p>
      </div>
    );
  }

  if (!voteLoaded) {
    return (
      <div className="bg-zinc-900 rounded-xl p-8 text-center">
        <p className="text-zinc-400">
          Loading your ballot...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      {alreadyVoted && !adminMode && (
        <div className="bg-amber-900/10 border border-amber-700 rounded-xl p-4">
          <h2 className="text-xl font-semibold text-amber-200">
            You already voted for this game.
          </h2>
          <p className="mt-2 text-zinc-300">
            Your previous selections are preloaded below. Change any pick and submit again to update your ballot.
          </p>
        </div>
      )}
      {adminMode && (
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-700">
          <h2 className="text-lg font-semibold mb-3">
            Admin Voting Mode
          </h2>
          <p className="text-sm text-zinc-400 mb-4">
            Enter or generate a voter ID to test multiple ballots. Use override to replace an existing ballot for the same voter.
          </p>

          <label className="block mb-2 font-semibold">
            Admin Voter ID
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={adminVoterId}
              onChange={(e) => setAdminVoterId(e.target.value)}
              placeholder="Enter voter ID or generate one"
              className="flex-1 p-3 rounded bg-zinc-900 border border-zinc-700"
            />
            <button
              type="button"
              onClick={() => setAdminVoterId(crypto.randomUUID())}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded"
            >
              Generate
            </button>
          </div>

          <label className="mt-4 inline-flex items-center gap-3 text-sm text-zinc-200">
            <input
              type="checkbox"
              checked={overrideExisting}
              onChange={(e) => setOverrideExisting(e.target.checked)}
              className="h-4 w-4 rounded bg-zinc-900 border border-zinc-700"
            />
            Override existing ballot for this voter ID if it already exists
          </label>
        </div>
      )}

      <div>
        <label className="block mb-2 font-semibold">Parent Name</label>
        <input
          value={voterName}
          onChange={(e) => setVoterName(e.target.value)}
          className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">
          🏆 GOAT (Pick 3 of the Games Goats)
        </label>
        <div className="space-y-2">
          {[0, 1, 2].map((index) => (
            <select
              key={index}
              value={goatVotes[index]}
              onChange={(e) => {
                const updated = [...goatVotes];
                updated[index] = e.target.value;
                setGoatVotes(updated);
              }}
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
            >
              <option value="">Select Player</option>
              {getAvailablePlayers(goatVotes[index], "goat").map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold">
          🔥 Hardest Worker (Pick 3)
        </label>
        <div className="space-y-2">
          {[0, 1, 2].map((index) => (
            <select
              key={index}
              value={workerVotes[index]}
              onChange={(e) => {
                const updated = [...workerVotes];
                updated[index] = e.target.value;
                setWorkerVotes(updated);
              }}
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
            >
              <option value="">Select Player</option>
              {getAvailablePlayers(workerVotes[index], "hardest_worker").map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold">
          🛡️ Unstoppable Defense (Pick 3)
        </label>
        <div className="space-y-2">
          {[0, 1, 2].map((index) => (
            <select
              key={index}
              value={defenseVotes[index]}
              onChange={(e) => {
                const updated = [...defenseVotes];
                updated[index] = e.target.value;
                setDefenseVotes(updated);
              }}
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
            >
              <option value="">Select Player</option>
              {getAvailablePlayers(defenseVotes[index], "unstoppable_defense").map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-bold"
      >
        Submit Vote
      </button>
    </div>
  );
}
