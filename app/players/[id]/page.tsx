import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { calculateFantasyPoints } from "@/lib/scoring";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PlayerPage({
  params,
}: Props) {
  const { id } = await params;

  const playerId = Number(id);

  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", playerId)
    .single();

  if (!player) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold">
          Player Not Found
        </h1>
      </main>
    );
  }

  const { data: stats } = await supabase
    .from("player_stats")
    .select(`
      *,
      games (
        id,
        name
      )
    `)
    .eq("player_id", playerId);

  const { data: scoringRows } = await supabase
    .from("fantasy_points_values")
    .select("*");

  const scoring = Object.fromEntries(
    (scoringRows ?? []).map((row) => [
      row.action,
      Number(row.value),
    ])
  );

  const seasonTotals = {
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

  let fantasyPoints = 0;

  (stats ?? []).forEach((stat) => {
    seasonTotals.goals += stat.goals ?? 0;
    seasonTotals.assists += stat.assists ?? 0;
    seasonTotals.defensive_stops +=
      stat.defensive_stops ?? 0;
    seasonTotals.goal_saves +=
      stat.goal_saves ?? 0;
    seasonTotals.great_passes +=
      stat.great_passes ?? 0;
    seasonTotals.hustle_plays +=
      stat.hustle_plays ?? 0;
    seasonTotals.positive_attitude +=
      stat.positive_attitude ?? 0;
    seasonTotals.good_sportsmanship +=
      stat.good_sportsmanship ?? 0;
    seasonTotals.penalties +=
      stat.penalties ?? 0;
    seasonTotals.yellow_cards +=
      stat.yellow_cards ?? 0;
    seasonTotals.red_cards +=
      stat.red_cards ?? 0;

    fantasyPoints +=
      calculateFantasyPoints(
        stat,
        scoring
      );
  });

  const { data: awardVotes } = await supabase
    .from("ballot_votes")
    .select("category")
    .eq("player_id", playerId);

  const goatAwards =
    awardVotes?.filter(
      (v) => v.category === "goat"
    ).length ?? 0;

  const workerAwards =
    awardVotes?.filter(
      (v) =>
        v.category ===
        "hardest_worker"
    ).length ?? 0;

  const defenseAwards =
    awardVotes?.filter(
      (v) =>
        v.category ===
        "unstoppable_defense"
    ).length ?? 0;

  return (
    <main className="min-h-screen bg-black text-white p-8">
        
      <div className="max-w-6xl mx-auto">

        <Link
          href="/"
          className="inline-block bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded mb-6"
        >
          ← Back Home
        </Link>

        <h1 className="text-4xl font-bold">
          {player.name}
        </h1>

        <p className="text-2xl text-red-400 mt-2">
          {fantasyPoints} Fantasy Points
        </p>

        {/* Awards */}

        <div className="grid md:grid-cols-3 gap-4 mt-8">

          <div className="bg-zinc-900 rounded-xl p-5">
            <h3 className="text-yellow-400 font-bold">
              🏆 GOAT Votes
            </h3>

            <p className="text-3xl font-bold mt-2">
              {goatAwards}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-5">
            <h3 className="text-orange-400 font-bold">
              🔥 Hardest Worker Votes
            </h3>

            <p className="text-3xl font-bold mt-2">
              {workerAwards}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-5">
            <h3 className="text-blue-400 font-bold">
              🛡️ Defense Votes
            </h3>

            <p className="text-3xl font-bold mt-2">
              {defenseAwards}
            </p>
          </div>

        </div>

        {/* Season Totals */}

        <div className="bg-zinc-900 rounded-xl p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Season Totals
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div>Goals: {seasonTotals.goals}</div>
            <div>Assists: {seasonTotals.assists}</div>
            <div>Stops: {seasonTotals.defensive_stops}</div>
            <div>Saves: {seasonTotals.goal_saves}</div>

            <div>Great Passes: {seasonTotals.great_passes}</div>
            <div>Hustle: {seasonTotals.hustle_plays}</div>
            <div>Attitude: {seasonTotals.positive_attitude}</div>
            <div>Sportsmanship: {seasonTotals.good_sportsmanship}</div>

            <div>Penalties: {seasonTotals.penalties}</div>
            <div>Yellow Cards: {seasonTotals.yellow_cards}</div>
            <div>Red Cards: {seasonTotals.red_cards}</div>

          </div>
        </div>

        {/* Game Log */}

        <div className="bg-zinc-900 rounded-xl p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Game History
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-3">
                  Game
                </th>

                <th className="text-center py-3">
                  Fantasy Points
                </th>
              </tr>
            </thead>

            <tbody>
              {(stats ?? []).map((stat) => (
                <tr
                  key={stat.id}
                  className="border-b border-zinc-800"
                >
                  <td className="py-3">
                    {stat.games?.name}
                  </td>

                  <td className="text-center">
                    {
                      calculateFantasyPoints(
                        stat,
                        scoring
                      )
                    }
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
        <div className="mb-6">
            <Link
                href="/admin/player-profiles"
                className="inline-block bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded"
            >
                ← Back to Player Preview
            </Link>
        </div>
      </div>
    </main>
    
  );
}