import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { calculateFantasyPoints } from "@/lib/scoring";

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

  function getWinner(category: string) {
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

    const winner = [...counts.values()].sort(
      (a, b) => b.votes - a.votes
    )[0];

    return winner;
  }

  const goatWinner =
    getWinner("goat");

  const workerWinner =
    getWinner("hardest_worker");

  const defenseWinner =
    getWinner("unstoppable_defense");

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-6">
        {game?.name}
      </h1>

      {/* Awards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-5">
          <div className="text-3xl mb-2">
            🏆
          </div>

          <h2 className="font-bold text-lg">
            GOAT
          </h2>

          <p className="mt-2">
            {goatWinner?.name ??
              "No votes yet"}
          </p>

          {goatWinner && (
            <p className="text-sm text-zinc-400">
              {goatWinner.votes} vote
              {goatWinner.votes !== 1
                ? "s"
                : ""}
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

          <p className="mt-2">
            {workerWinner?.name ??
              "No votes yet"}
          </p>

          {workerWinner && (
            <p className="text-sm text-zinc-400">
              {workerWinner.votes} vote
              {workerWinner.votes !== 1
                ? "s"
                : ""}
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

          <p className="mt-2">
            {defenseWinner?.name ??
              "No votes yet"}
          </p>

          {defenseWinner && (
            <p className="text-sm text-zinc-400">
              {defenseWinner.votes} vote
              {defenseWinner.votes !== 1
                ? "s"
                : ""}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <Link
          href={`/vote/${id}`}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Vote For Awards
        </Link>

        <Link
          href="/"
          className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-lg transition"
        >
          ← Back to Home
        </Link>
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

                <th className="text-center py-3">
                  <span className="hidden md:inline">Goals</span>
                  <span className="md:hidden">G</span>
                </th>

                <th className="text-center py-3">
                  <span className="hidden md:inline">Assists</span>
                  <span className="md:hidden">A</span>
                </th>

                <th className="text-center py-3">
                  <span className="hidden md:inline">Stops</span>
                  <span className="md:hidden">D</span>
                </th>

                <th className="text-center py-3">
                  <span className="hidden md:inline">Great Passes</span>
                  <span className="md:hidden">GP</span>
                </th>

                <th className="text-center py-3">
                  <span className="hidden md:inline">Hustle</span>
                  <span className="md:hidden">H</span>
                </th>

                <th className="text-center py-3">
                  <span className="hidden md:inline">Attitude</span>
                  <span className="md:hidden">ATT</span>
                </th>

                <th className="text-center py-3">
                  <span className="hidden md:inline">Sportsmanship</span>
                  <span className="md:hidden">SP</span>
                </th>

                <th className="text-center py-3 text-red-400">
                  <span className="hidden md:inline">
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
                  className="border-b border-zinc-800"
                >
                  <td className="py-3">
                    {stat.players?.name}
                  </td>

                  <td className="text-center">
                    {stat.goals}
                  </td>

                  <td className="text-center">
                    {stat.assists}
                  </td>

                  <td className="text-center">
                    {stat.defensive_stops}
                  </td>

                  <td className="text-center">
                    {stat.great_passes}
                  </td>

                  <td className="text-center">
                    {stat.hustle_plays}
                  </td>

                  <td className="text-center">
                    {stat.positive_attitude}
                  </td>

                  <td className="text-center">
                    {stat.good_sportsmanship}
                  </td>

                  <td className="text-center font-bold text-red-400">
                    {stat.fantasyPoints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-sm text-zinc-400">
            <p>
              <strong>Legend:</strong>
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              <span>G = Goals</span>
              <span>A = Assists</span>
              <span>D = Defensive Stops</span>
              <span>GP = Great Passes</span>
              <span>H = Hustle Plays</span>
              <span>ATT = Positive Attitude</span>
              <span>SP = Sportsmanship</span>
              <span>FP = Fantasy Points</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}