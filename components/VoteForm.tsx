"use client";

import { useState } from "react";

type Player = {
  id: number;
  name: string;
};

type Props = {
  gameId: number;
  players: Player[];
};

export default function VoteForm({
  gameId,
  players,
}: Props) {
  const [voterName, setVoterName] = useState("");

  const [goat, setGoat] = useState("");
  const [hardestWorker, setHardestWorker] =
    useState("");
  const [unstoppableDefense, setUnstoppableDefense] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const goatOptions = players.filter(
    (player) =>
      String(player.id) !== hardestWorker &&
      String(player.id) !== unstoppableDefense
  );

  const hardestWorkerOptions = players.filter(
    (player) =>
      String(player.id) !== goat &&
      String(player.id) !== unstoppableDefense
  );

  const defenseOptions = players.filter(
    (player) =>
      String(player.id) !== goat &&
      String(player.id) !== hardestWorker
  );

  async function handleSubmit() {
    if (!voterName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (
      !goat ||
      !hardestWorker ||
      !unstoppableDefense
    ) {
      alert(
        "Please make all three selections."
      );
      return;
    }

    if (
      goat === hardestWorker ||
      goat === unstoppableDefense ||
      hardestWorker === unstoppableDefense
    ) {
      alert(
        "A player may only be selected once."
      );
      return;
    }

    const res = await fetch("/api/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId,
        voterName,
        goat: Number(goat),
        hardestWorker:
          Number(hardestWorker),
        unstoppableDefense:
          Number(unstoppableDefense),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(
        data.error ||
          "Failed to submit vote."
      );
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

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <label className="block mb-2 font-semibold">
          Parent Name
        </label>

        <input
          value={voterName}
          onChange={(e) =>
            setVoterName(e.target.value)
          }
          className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">
          🏆 GOAT
        </label>

        <select
          value={goat}
          onChange={(e) =>
            setGoat(e.target.value)
          }
          className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
        >
          <option value="">
            Select Player
          </option>

          {goatOptions.map((player) => (
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
        <label className="block mb-2 font-semibold">
          🔥 Hardest Worker
        </label>

        <select
          value={hardestWorker}
          onChange={(e) =>
            setHardestWorker(
              e.target.value
            )
          }
          className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
        >
          <option value="">
            Select Player
          </option>

          {hardestWorkerOptions.map(
            (player) => (
              <option
                key={player.id}
                value={player.id}
              >
                {player.name}
              </option>
            )
          )}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-semibold">
          🛡️ Unstoppable Defense
        </label>

        <select
          value={unstoppableDefense}
          onChange={(e) =>
            setUnstoppableDefense(
              e.target.value
            )
          }
          className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
        >
          <option value="">
            Select Player
          </option>

          {defenseOptions.map((player) => (
            <option
              key={player.id}
              value={player.id}
            >
              {player.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-bold"
      >
        Submit Vote
      </button>
    </div>
  );
}