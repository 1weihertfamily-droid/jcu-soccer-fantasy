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
};

export default function VoteForm({
  gameId,
  players,
}: Props) {
  const [voterName, setVoterName] = useState("");

  const [goatVotes, setGoatVotes] = useState([
  "",
  "",
  "",
]);

const [alreadyVoted, setAlreadyVoted] =
  useState(false);

useEffect(() => { 
  async function checkVote() {
     const voterId = getVoterId();
     const res = await fetch(
       `/api/vote/check?gameId=${gameId}&voterId=${voterId}` 
      ); 
      const data = await res.json(); 
      setAlreadyVoted(data.alreadyVoted); 
    } 
    
    checkVote(); 
}, [gameId]);  
const [workerVotes, setWorkerVotes] =
  useState(["", "", ""]);

const [defenseVotes, setDefenseVotes] =
  useState(["", "", ""]);

  const allSelections = [
  ...goatVotes,
  ...workerVotes,
  ...defenseVotes,
].filter(Boolean);

function getAvailablePlayers(
  currentValue: string
) {
  return players.filter(
    (player) =>
      String(player.id) === currentValue ||
      !allSelections.includes(
        String(player.id)
      )
  );
}

  const [submitted, setSubmitted] =
    useState(false);

function hasDuplicates(
  votes: string[]
) {
  const filled = votes.filter(Boolean);

  return (
    new Set(filled).size !==
    filled.length
  );
}

  async function handleSubmit() {
    console.log({
  goatVotes,
  workerVotes,
  defenseVotes,
});
if (!voterName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (
  goatVotes.some((v) => !v) ||
  workerVotes.some((v) => !v) ||
  defenseVotes.some((v) => !v)
) {
  alert(
    "Please select 3 players in every category."
  );
  return;
} 

const uniqueSelections =
  new Set(allSelections);

if (
  uniqueSelections.size !==
  allSelections.length
) {
  alert(
    "Each player may only be selected once on the ballot."
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
        voterId: getVoterId(),
        voterName,

        goatVotes:
          goatVotes.map(Number),

        hardestWorkerVotes:
          workerVotes.map(Number),

        unstoppableDefenseVotes:
          defenseVotes.map(Number),
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

if (alreadyVoted) { 
  return (
    <div className="bg-zinc-900 rounded-xl p-8 text-center"> 
      <h2 className="text-3xl font-bold mb-4">
        🗳️ Vote Already Submitted 
        </h2> 
        <p className="text-zinc-300"> 
          This device has already voted for this game. 
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
    🏆 GOAT (Pick 3 of the Games Goats)
  </label>

  <div className="space-y-2">
    {[0, 1, 2].map((index) => (
      <select
        key={index}
        value={goatVotes[index]}
        onChange={(e) => {
          const updated = [
            ...goatVotes,
          ];

          updated[index] =
            e.target.value;

          setGoatVotes(updated);
        }}
        className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
      >
        <option value="">
          Select Player
        </option>

        {getAvailablePlayers(
    goatVotes[index]
      ).map((player) => (
          <option
            key={player.id}
            value={player.id}
          >
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
          const updated = [
            ...workerVotes,
          ];

          updated[index] =
            e.target.value;

          setWorkerVotes(updated);
        }}
        className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
      >
        <option value="">
          Select Player
        </option>

        {getAvailablePlayers(
          workerVotes[index]
        ).map((player) => (
          <option
            key={player.id}
            value={player.id}
          >
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
          const updated = [
            ...defenseVotes,
          ];

          updated[index] =
            e.target.value;

          setDefenseVotes(updated);
        }}
        className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
      >
        <option value="">
          Select Player
        </option>

        {getAvailablePlayers(
            defenseVotes[index]
          ).map((player) => (
          <option
            key={player.id}
            value={player.id}
          >
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