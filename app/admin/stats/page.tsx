"use client";

import { useEffect, useState } from "react";

type Player = {
  id: number;
  name: string;
};

type Game = {
  id: number;
  name: string;
};

type PlayerRow = {
  player_id: number;
  player_name: string;
  goals: number;
  assists: number;
  defensive_stops: number;
  goal_saves: number;
  great_passes: number;
  hustle_plays: number;
  positive_attitude: number;
  good_sportsmanship: number;
  penalties: number;
  yellow_cards: number;
  red_cards: number;
};

export default function AdminPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedGame, setSelectedGame] = useState("");
const [rows, setRows] = useState<PlayerRow[]>([]);

useEffect(() => {
  async function loadData() {
    try {
      const gamesRes = await fetch("/api/games");
      const playersRes = await fetch("/api/players");

      const gamesData = await gamesRes.json();
      const playersData = await playersRes.json();

      console.log("GAMES:", gamesData);
      console.log("PLAYERS:", playersData);

      setGames(gamesData);
      setPlayers(playersData);

      setRows(
        playersData.map((player: Player) => ({
          player_id: player.id,
          player_name: player.name,
          goals: 0,
          assists: 0,
          defensive_stops: 0,
          goal_saves: 0,
          great_passes: 0,
          hustle_plays: 0,
          positive_attitude: 0,
          good_sportsmanship: 0,
          penalties: 0,
          yellow_cards: 0,
          red_cards: 0,
        }))
      );
    } catch (err) {
      console.error("LOAD ERROR:", err);
    }
  }

  loadData();
}, []);

useEffect(() => {
  if (!selectedGame) return;

  async function loadStats() {
    try {
      console.log(
        "Loading stats for game:",
        selectedGame
      );

      const res = await fetch(
        `/api/stats/${selectedGame}`
      );

      if (!res.ok) {
        console.error(
          "Stats endpoint returned:",
          res.status
        );
        return;
      }

      const stats = await res.json();

      console.log("STATS:", stats);

      setRows((currentRows) =>
        currentRows.map((row) => {
          const stat = stats.find(
            (s: any) =>
              Number(s.player_id) ===
              Number(row.player_id)
          );

          if (!stat) {
            return {
              ...row,
              goals: 0,
              assists: 0,
              defensive_stops: 0,
              goal_saves: 0,
              great_passes: 0,
              hustle_plays: 0,
              positive_attitude: 0,
              good_sportsmanship: 0,
              penalties: 0,
              yellow_cards: 0,
              red_cards: 0,
            };
          }

          return {
            ...row,
            goals: stat.goals ?? 0,
            assists: stat.assists ?? 0,
            defensive_stops:
              stat.defensive_stops ?? 0,
            goal_saves: stat.goal_saves ?? 0,
            great_passes:
              stat.great_passes ?? 0,
            hustle_plays:
              stat.hustle_plays ?? 0,
            positive_attitude:
              stat.positive_attitude ?? 0,
            good_sportsmanship:
              stat.good_sportsmanship ?? 0,
            penalties: stat.penalties ?? 0,
            yellow_cards:
              stat.yellow_cards ?? 0,
            red_cards:
              stat.red_cards ?? 0,
          };
        })
      );
    } catch (err) {
      console.error(
        "STAT LOAD ERROR:",
        err
      );
    }
  }

  loadStats();
}, [selectedGame]);

  function updateStat(
    playerId: number,
    field: keyof Omit<PlayerRow, "player_id" | "player_name">,
    value: number
  ) {
    setRows((current) =>
      current.map((row) =>
        row.player_id === playerId
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  }

  async function handleSave() {
  if (!selectedGame) {
    alert("Please select a game.");
    return;
  }

  const response = await fetch(
    "/api/stats/save",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        game_id: selectedGame,
        rows,
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

  alert("Stats saved!");
}


  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-[1800px] mx-auto">
        <h1 className="text-5xl font-bold mb-8">
          Admin Stat Entry
        </h1>

        <div className="mb-8">
          <label className="block mb-2 font-semibold">
            Game
          </label>

          <select
            value={selectedGame}
            onChange={(e) =>
              setSelectedGame(e.target.value)
            }
            className="w-full max-w-md p-3 rounded bg-zinc-800 border border-zinc-600 text-white"
          >
            <option value="">
              Select Game
            </option>

            {games.map((game) => (
              <option
                key={game.id}
                value={game.id}
              >
                {game.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left p-2 min-w-[160px]">
                  Player
                </th>

                <th className="p-2">Goals</th>
                <th className="p-2">Assists</th>
                <th className="p-2">Stops</th>
                <th className="p-2">Saves</th>
                <th className="p-2">Great Passes</th>
                <th className="p-2">Hustle</th>
                <th className="p-2">Attitude</th>
                <th className="p-2">
                  Sportsmanship
                </th>
                <th className="p-2">Penalties</th>
                <th className="p-2">YC</th>
                <th className="p-2">RC</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.player_id}
                  className="border-b border-zinc-800"
                >
                  <td className="p-2 font-medium">
                    {row.player_name}
                  </td>

                  <StatCell
                    value={row.goals}
                    onChange={(v) =>
                      updateStat(
                        row.player_id,
                        "goals",
                        v
                      )
                    }
                  />

                  <StatCell
                    value={row.assists}
                    onChange={(v) =>
                      updateStat(
                        row.player_id,
                        "assists",
                        v
                      )
                    }
                  />

                  <StatCell
                    value={row.defensive_stops}
                    onChange={(v) =>
                      updateStat(
                        row.player_id,
                        "defensive_stops",
                        v
                      )
                    }
                  />

                  <StatCell
                    value={row.goal_saves}
                    onChange={(v) =>
                      updateStat(
                        row.player_id,
                        "goal_saves",
                        v
                      )
                    }
                  />

                  <StatCell
                    value={row.great_passes}
                    onChange={(v) =>
                      updateStat(
                        row.player_id,
                        "great_passes",
                        v
                      )
                    }
                  />

                  <StatCell
                    value={row.hustle_plays}
                    onChange={(v) =>
                      updateStat(
                        row.player_id,
                        "hustle_plays",
                        v
                      )
                    }
                  />

                  <StatCell
                    value={row.positive_attitude}
                    onChange={(v) =>
                      updateStat(
                        row.player_id,
                        "positive_attitude",
                        v
                      )
                    }
                  />

                  <StatCell
                    value={row.good_sportsmanship}
                    onChange={(v) =>
                      updateStat(
                        row.player_id,
                        "good_sportsmanship",
                        v
                      )
                    }
                  />

                  <StatCell
                    value={row.penalties}
                    onChange={(v) =>
                      updateStat(
                        row.player_id,
                        "penalties",
                        v
                      )
                    }
                  />

                  <StatCell
                    value={row.yellow_cards}
                    onChange={(v) =>
                      updateStat(
                        row.player_id,
                        "yellow_cards",
                        v
                      )
                    }
                  />

                  <StatCell
                    value={row.red_cards}
                    onChange={(v) =>
                      updateStat(
                        row.player_id,
                        "red_cards",
                        v
                      )
                    }
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleSave}
          className="mt-8 bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-bold"
        >
          Save All Stats
        </button>
      </div>
    </main>
  );
}

function StatCell({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <td className="p-2">
      <input
        type="number"
        min="0"
        value={value === 0 ? "" : value}
        onChange={(e) =>
          onChange(
            e.target.value === ""
              ? 0
              : Number(e.target.value)
          )
        }
        className="w-20 p-2 rounded bg-zinc-800 border border-zinc-700 text-center text-white"
      />
    </td>
  );
}