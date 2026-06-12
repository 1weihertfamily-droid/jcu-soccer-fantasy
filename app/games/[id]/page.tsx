import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { calculateFantasyPoints } from "@/lib/scoring";
import HomeButton from "@/components/HomeButton";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GamePage({
  params,
}: Props) {
  const { id } = await params;

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .single();

  const { data: stats } = await supabase
    .from("player_stats")
    .select(`
      *,
      players (
        name
      )
    `)
    .eq("game_id", id);

  const { data: scoringRows } = await supabase
    .from("fantasy_points_values")
    .select("*");

  const scoring = Object.fromEntries(
    (scoringRows ?? []).map((row) => [
      row.action,
      Number(row.value),
    ])
  );

  const rows = (stats ?? [])
    .map((stat) => ({
      ...stat,
      fantasyPoints: calculateFantasyPoints(
        stat,
        scoring
      ),
    }))
    .sort(
      (a, b) => b.fantasyPoints - a.fantasyPoints
    );

   // ---------------------------
  // Award Voting
  // ---------------------------

  const { data: ballots } = await supabase
    .from("ballots")
    .select("id")
    .eq("game_id", Number(id));

  const ballotIds =
    ballots?.map((b) => b.id) ?? [];

  const { data: votes } = await supabase
    .from("ballot_votes")
    .select("*")
    .in("ballot_id", ballotIds);

  const { data: players, error } = await supabase
    .from("players")
    .select("*")
    .eq("active", true)
    .order("name");

  const playerMap = new Map(
    (players ?? []).map((player) => [
      player.id,
      player.name,
    ])
  );

  function getWinners(category: string) {
  const categoryVotes =
    votes?.filter(
      (vote) => vote.category === category
    ) ?? [];

  const counts = new Map<
    number,
    {
      name: string;
      votes: number;
    }
  >();

  categoryVotes.forEach((vote: any) => {
    const existing = counts.get(
      vote.player_id
    );

    if (existing) {
      existing.votes += 1;
    } else {
      counts.set(vote.player_id, {
        name:
          playerMap.get(vote.player_id) ??
          "Unknown Player",
        votes: 1,
      });
    }
  });

  const sorted = [...counts.values()].sort(
    (a, b) => b.votes - a.votes
  );

  if (!sorted.length) return [];

  const topVotes = sorted[0].votes;

  return sorted.filter(
    (player) =>
      player.votes === topVotes
  );
}

const goatWinners =
  getWinners("goat");

const workerWinners =
  getWinners("hardest_worker");

const defenseWinners =
  getWinners("unstoppable_defense");

const displayStat = (value: number) =>
  value > 0 ? value : "";

  return (
    <main className="min-h-screen bg-black text-white p-8">
  <div className="max-w-6xl mx-auto">

    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

      <h1 className="text-4xl font-bold">
        {game?.name}
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

        <Link
          href={`/vote/${id}`}
          className="
            bg-green-600 hover:bg-green-700
            text-white font-semibold
            px-6 py-3 rounded-lg transition
            text-center
            w-full sm:w-auto
          "
        >
          Vote For Awards
        </Link>

        <HomeButton />

      </div>

    </div>

{/* Awards */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-5">
    <div className="text-3xl mb-2">
      🏆
    </div>

    <h2 className="font-bold text-lg">
      GOAT
    </h2>

    {goatWinners?.length ? (
      <>
        <div className="mt-2 font-semibold">
          {goatWinners.map((player) => (
            <div key={player.name}>
              {player.name}
            </div>
          ))}
        </div>

        <p className="text-sm text-zinc-400 mt-2">
          {goatWinners.length > 1
            ? `🏅 Tied • ${goatWinners[0].votes} votes each`
            : `${goatWinners[0].votes} vote${
                goatWinners[0].votes !== 1
                  ? "s"
                  : ""
              }`}
        </p>
      </>
    ) : (
      <p className="mt-2">
        No votes yet
      </p>
    )}
  </div>

  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-5">
    <div className="text-3xl mb-2">
      🔥
    </div>

    <h2 className="font-bold text-lg">
      Hardest Worker
    </h2>

    {workerWinners?.length ? (
      <>
        <div className="mt-2 font-semibold">
          {workerWinners.map((player) => (
            <div key={player.name}>
              {player.name}
            </div>
          ))}
        </div>

        <p className="text-sm text-zinc-400 mt-2">
          {workerWinners.length > 1
            ? `🏅 Tied • ${workerWinners[0].votes} votes each`
            : `${workerWinners[0].votes} vote${
                workerWinners[0].votes !== 1
                  ? "s"
                  : ""
              }`}
        </p>
      </>
    ) : (
      <p className="mt-2">
        No votes yet
      </p>
    )}
  </div>

  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-5">
    <div className="text-3xl mb-2">
      🛡️
    </div>

    <h2 className="font-bold text-lg">
      Unstoppable Defense
    </h2>

    {defenseWinners?.length ? (
      <>
        <div className="mt-2 font-semibold">
          {defenseWinners.map((player) => (
            <div key={player.name}>
              {player.name}
            </div>
          ))}
        </div>

        <p className="text-sm text-zinc-400 mt-2">
          {defenseWinners.length > 1
            ? `🏅 Tied • ${defenseWinners[0].votes} votes each`
            : `${defenseWinners[0].votes} vote${
                defenseWinners[0].votes !== 1
                  ? "s"
                  : ""
              }`}
        </p>
      </>
    ) : (
      <p className="mt-2">
        No votes yet
      </p>
    )}
  </div>
</div>

  

      {!rows.length ? (
        <p>No stats entered yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-3">
                  Player
                </th>

                <th className="text-center py-3 border-l border-zinc-700">
                  <span className="hidden md:inline">Goals</span>
                  <span className="md:hidden">G</span>
                </th>

                <th className="text-center py-3 border-l border-zinc-700">
                  <span className="hidden md:inline">Assists</span>
                  <span className="md:hidden">A</span>
                </th>

                <th className="text-center py-3 border-l border-zinc-700">
                  <span className="hidden md:inline">Stops</span>
                  <span className="md:hidden">D</span>
                </th>

                <th className="text-center py-3 border-l border-zinc-700">
                  <span className="hidden md:inline">Saves</span>
                  <span className="md:hidden">S</span>
                </th>

                <th className="text-center py-3 border-l border-zinc-700">
                  <span className="hidden md:inline">Great Passes</span>
                  <span className="md:hidden">GP</span>
                </th>

                <th className="text-center py-3 border-l border-zinc-700">
                  <span className="hidden md:inline">Hustle</span>
                  <span className="md:hidden">H</span>
                </th>

                <th className="text-center py-3 border-l border-zinc-700">
                  <span className="hidden md:inline">Attitude</span>
                  <span className="md:hidden">ATT</span>
                </th>

                <th className="text-center py-3 border-l border-zinc-700">
                  <span className="hidden md:inline">Sportsmanship</span>
                  <span className="md:hidden">SP</span>
                </th>

                <th className="text-center py-3 border-l border-zinc-700">
                  <span className="hidden md:inline text-red-300">Penalties</span>
                  <span className="md:hidden text-red-300">P</span>
                </th>

                <th className="text-center py-3 border-l border-zinc-700">
                  <span className="hidden md:inline text-yellow-400">Yellow Cards</span>
                  <span className="md:hidden text-yellow-400">YC</span>
                </th>

                <th className="text-center py-3 border-l border-zinc-700">
                  <span className="hidden md:inline text-red-400">Red Cards</span>
                  <span className="md:hidden text-red-400">RC</span>
                </th>

                <th className="text-center py-3 border-l border-zinc-700 text-green-500">
                  <span className="hidden md:inline text-green-500 font-bold">
                    Fantasy Pts
                  </span>
                  <span className="md:hidden">FP</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((stat) => (
                <tr
                  key={stat.id}
                  className="
                    border-b border-zinc-800
                    odd:bg-zinc-900/20
                    hover:bg-zinc-800/40
                    transition-colors
                  "
                >
                  <td className="py-3">
                    <Link
                      href={`/players/${stat.player_id}`}
                      className="hover:text-blue-400 hover:underline"
                    >
                      {stat.players?.name}
                    </Link>
                  </td>

                  <td className="text-center border-l border-zinc-800">
                    {displayStat(stat.goals)}
                  </td>

                  <td className="text-center border-l border-zinc-800">
                    {displayStat(stat.assists)}
                  </td>

                  <td className="text-center border-l border-zinc-800">
                    {displayStat(stat.defensive_stops)}
                  </td>

                  <td className="text-center border-l border-zinc-800">
                    {displayStat(stat.goal_saves)}
                  </td>

                  <td className="text-center border-l border-zinc-800">
                    {displayStat(stat.great_passes)}
                  </td>

                  <td className="text-center border-l border-zinc-800">
                    {displayStat(stat.hustle_plays)}
                  </td>

                  <td className="text-center border-l border-zinc-800">
                    {displayStat(stat.positive_attitude)}
                  </td>

                  <td className="text-center border-l border-zinc-800">
                    {displayStat(stat.good_sportsmanship)}
                  </td>

                  <td className="text-center text-red-300 border-l border-zinc-800">
                    {displayStat(stat.penalties)}
                  </td>

                  <td className="text-center text-yellow-400 border-l border-zinc-800">
                    {displayStat(stat.yellow_cards)}
                  </td>

                  <td className="text-center text-red-400 border-l border-zinc-800">
                    {displayStat(stat.red_cards)}
                  </td>

                  <td className="text-center text-green-500 border-l border-zinc-800 font-bold">
                    {displayStat(stat.fantasyPoints)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">
              Stat Legend
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-zinc-300">
              <div><span className="font-bold text-white">G</span> = Goals Scored</div>
              <div><span className="font-bold text-white">A</span> = Assists</div>
              <div><span className="font-bold text-white">D</span> = Defensive Stops</div>
              <div><span className="font-bold text-white">S</span> = Goalkeeper Saves</div>

              <div><span className="font-bold text-white">GP</span> = Great Passes</div>
              <div><span className="font-bold text-white">H</span> = Hustle Plays</div>
              <div><span className="font-bold text-white">ATT</span> = Positive Attitude</div>
              <div><span className="font-bold text-white">SP</span> = Good Sportsmanship</div>

              <div><span className="font-bold text-red-300">P</span> = Penalties Committed</div>
              <div><span className="font-bold text-yellow-400">YC</span> = Yellow Cards</div>
              <div><span className="font-bold text-red-400">RC</span> = Red Cards</div>
              <div><span className="font-bold text-green-500">FP</span> = Fantasy Points</div>
            </div>
          </div>
        </div>
      )}
    </div>
  </main>
  );
}