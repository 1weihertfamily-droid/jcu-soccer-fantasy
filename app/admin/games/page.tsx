"use client";

import { useEffect, useState } from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import Link from "next/link";
import AdminDashboardButton from "@/components/AdminDashboardButton";
import AdminGameRow from "@/components/AdminGameRow";

type Game = {
  id: number;
  name: string;
  game_date: string | null;
  active: boolean;
  voting_open: boolean;
  display_order: number | null;
  season_id: number | null;
};

type Season = {
  id: number;
  name: string;
  active: boolean;
};

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [seasons, setSeasons] =
  useState<Season[]>([]);

const [selectedSeason, setSelectedSeason] =
  useState<number | null>(null);
  const [newGame, setNewGame] = useState("");

async function loadSeasons() {
  const res = await fetch(
    "/api/admin/seasons"
  );

  const data = await res.json();

  setSeasons(data);

  const activeSeason =
    data.find(
      (s: Season) => s.active
    );

  if (activeSeason) {
    setSelectedSeason(
      activeSeason.id
    );
  }
}

 async function loadGames() {
  if (selectedSeason == null) return;

  const res = await fetch(
    `/api/admin/games?seasonId=${selectedSeason}`
  );

  if (!res.ok) {
    alert("Failed to load games");
    return;
  }

  const data = await res.json();
  setGames(data);
}

function handleDragEnd(result: any) {
  if (!result.destination) return;

  const reordered = [...games];

  const [movedItem] = reordered.splice(
    result.source.index,
    1
  );

  reordered.splice(
    result.destination.index,
    0,
    movedItem
  );

  const updatedGames = reordered.map(
    (game, index) => ({
      ...game,
      display_order: index + 1,
    })
  );

  setGames(updatedGames);
}

useEffect(() => {
  loadSeasons();
}, []);

useEffect(() => {
  if (selectedSeason) {
    loadGames();
  }
}, [selectedSeason]);

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
        season_id: selectedSeason,
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
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        gameId,
      }),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    alert(
      `Reset failed: ${result.error}`
    );
    return;
  }

  alert(
    "Voting successfully reset."
  );
}

async function clearGameStats(
  gameId: number
) {
  const confirmed = confirm(
    "Delete ALL player stats for this game?"
  );

  if (!confirmed) return;

  const response = await fetch(
    "/api/admin/games/reset-stats",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        gameId,
      }),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    alert(
      `Reset failed: ${result.error}`
    );
    return;
  }

  alert(
    "Game stats successfully cleared."
  );
}
  
const filteredGames = games;

return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">
            Manage Games
          </h1>

          <AdminDashboardButton />
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

      <div className="mb-6">
        <label className="block mb-2 text-sm text-zinc-400">
          Season
        </label>

        <select
          value={selectedSeason ?? ""}
          onChange={(e) =>
            setSelectedSeason(
              Number(e.target.value)
            )
          }
          className="
            bg-zinc-800
            border border-zinc-700
            rounded
            p-3
            w-full
            max-w-sm
          "
        >
          {seasons.map((season) => (
            <option
              key={season.id}
              value={season.id}
            >
              {season.name}
            </option>
          ))}
        </select>
      </div>

        <div className="bg-zinc-900 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left p-4 w-12">
                  ☰
                </th>

                <th className="text-left p-4">
                  Game Name
                </th>

                <th className="p-2 text-left">
                  Date
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

            <DragDropContext
              onDragEnd={handleDragEnd}
            >
              <Droppable droppableId="games">
                {(provided) => (
                  <tbody
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {filteredGames.map((game, index) => (
                      <Draggable
                        key={String(game.id)}
                        draggableId={String(game.id)}
                        index={index}
                      >
                        {(provided) => (
                          <AdminGameRow
                            game={game}
                            provided={provided}
                            onUpdateGame={updateGame}
                            onResetVoting={resetVoting}
                            onClearStats={clearGameStats}
                          />
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </DragDropContext>
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