"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HomeButton from "@/components/HomeButton";

type Season = {
  id: number;
  name: string;
  active: boolean;
};

type Game = {
  id: number;
  name: string;
  game_date: string | null;
  voting_open: boolean;
};

export default function GamesPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | "">("");
  const [games, setGames] = useState<Game[]>([]);
  const [loadingSeasons, setLoadingSeasons] = useState(true);
  const [loadingGames, setLoadingGames] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSeasons() {
      try {
        setLoadingSeasons(true);
        const res = await fetch("/api/admin/seasons");
        if (!res.ok) {
          throw new Error("Unable to load seasons.");
        }

        const data: Season[] = await res.json();
        setSeasons(data);

        const params = new URLSearchParams(window.location.search);
        const seasonIdFromUrl = params.get("seasonId");
        const parsedId = seasonIdFromUrl
          ? Number.parseInt(seasonIdFromUrl, 10)
          : undefined;

        if (
          parsedId !== undefined &&
          Number.isFinite(parsedId) &&
          data.some((season) => season.id === parsedId)
        ) {
          setSelectedSeasonId(parsedId);
          return;
        }

        const activeSeason = data.find((season) => season.active);
        if (activeSeason) {
          setSelectedSeasonId(activeSeason.id);
          return;
        }

        if (data.length > 0) {
          setSelectedSeasonId(data[0].id);
        }
      } catch (err) {
        setError((err as Error).message || "Failed to load seasons.");
      } finally {
        setLoadingSeasons(false);
      }
    }

    loadSeasons();
  }, []);

  useEffect(() => {
    if (selectedSeasonId === "") {
      return;
    }

    async function loadGames() {
      try {
        setLoadingGames(true);
        const res = await fetch(
          `/api/admin/games?seasonId=${selectedSeasonId}`
        );

        if (!res.ok) {
          throw new Error("Unable to load games.");
        }

        const data: Game[] = await res.json();
        setGames(data);
      } catch (err) {
        setError((err as Error).message || "Failed to load games.");
      } finally {
        setLoadingGames(false);
      }
    }

    loadGames();
  }, [selectedSeasonId]);

  function handleSeasonChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    const seasonId = value === "" ? "" : Number(value);
    setSelectedSeasonId(seasonId);

    const params = new URLSearchParams(window.location.search);
    if (value === "") {
      params.delete("seasonId");
    } else {
      params.set("seasonId", value);
    }

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    window.history.replaceState({}, "", newUrl);
  }

  const selectedSeason = seasons.find(
    (season) => season.id === selectedSeasonId
  );

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-bold">⚽ Game Archive</h1>
            <p className="text-zinc-400 mt-2">
              Browse stats, awards, and voting results from every game.
            </p>
          </div>

          <HomeButton />
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1 min-w-[220px]">
              <label className="block mb-2 font-semibold" htmlFor="seasonId">
                Season
              </label>
              <select
                id="seasonId"
                name="seasonId"
                value={selectedSeasonId}
                onChange={handleSeasonChange}
                className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 text-white"
              >
                {seasons.length ? (
                  seasons.map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.name}
                      {season.active ? " (active)" : ""}
                    </option>
                  ))
                ) : (
                  <option value="">No seasons available</option>
                )}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-zinc-400">
            Showing games for: {selectedSeason?.name ?? "No season selected"}
          </div>
        </div>

        {error ? (
          <div className="bg-red-900 rounded-xl p-6 text-red-100">
            {error}
          </div>
        ) : loadingSeasons ? (
          <div className="bg-zinc-900 rounded-xl p-6">Loading seasons…</div>
        ) : loadingGames ? (
          <div className="bg-zinc-900 rounded-xl p-6">Loading games…</div>
        ) : !games.length ? (
          <div className="bg-zinc-900 rounded-xl p-6">
            No games found for this season.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:bg-zinc-800 transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold">{game.name}</h2>

                  {game.voting_open && (
                    <span className="bg-green-600 text-xs px-2 py-1 rounded">
                      Voting Open
                    </span>
                  )}
                </div>

                {game.game_date && (
                  <p className="text-zinc-400 text-sm">
                    {new Date(game.game_date).toLocaleDateString()}
                  </p>
                )}

                <div className="mt-4 text-blue-400 text-sm">View Game Details →</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
