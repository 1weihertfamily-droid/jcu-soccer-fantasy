"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminBackButton from "@/components/AdminBackButton";
import AwardResultsCard from "@/components/AwardResultsCard";
import AwardsFilters from "@/components/AwardsFilters";
import HomeButton from "@/components/HomeButton";

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

  function renderPlayer(player: AwardPlayer | undefined) {
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

          <HomeButton />
        </div>

        <Link
          href="/games"
          className="
            block
            mb-8
            bg-green-600
            hover:bg-green-700
            text-white
            text-center
            font-bold
            text-xl
            py-4
            rounded-xl
            transition
          "
        >
          🗳️ Vote For Player Awards
        </Link>

        <AwardsFilters
          games={games}
          players={players}
          selectedGame={selectedGame}
          selectedPlayer={selectedPlayer}
          selectedCategory={selectedCategory}
          onGameChange={setSelectedGame}
          onPlayerChange={setSelectedPlayer}
          onCategoryChange={setSelectedCategory}
        />

        {filteredGames.map((game) => (
          <AwardResultsCard
            key={game.gameId}
            gameId={game.gameId}
            goat={game.goat}
            hardestWorker={game.hardestWorker}
            defense={game.defense}
            selectedCategory={selectedCategory}
            selectedPlayer={selectedPlayer}
            renderPlayer={renderPlayer}
          />
        ))}

        <div className="w-full sm:w-auto">
        <AdminBackButton />
      </div>
      </div>
    </main>
  );
}