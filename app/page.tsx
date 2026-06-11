import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { buildLeaderboard } from "@/lib/leaderboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: activeGames } = await supabase
  .from("games")
  .select("*")
  .eq("active", true)
  .order("display_order");

  const games = activeGames ?? [];

  const { data: players, error } = await supabase
    .from("players")
    .select("*")
    .eq("active", true)
    .order("name");

  const { data: stats } = await supabase
    .from("player_stats")
    .select("*");

  const {
  data: rosters,
  error: rosterError,
} = await supabase
  .from("game_rosters")
  .select("*");

console.log("ROSTERS:", rosters);
console.log("ROSTER ERROR:", rosterError);

  const { data: scoringRows } = await supabase
    .from("fantasy_points_values")
    .select("*");

  const scoring = Object.fromEntries(
    (scoringRows ?? []).map((row) => [
      row.action,
      Number(row.value),
    ])
  );

  const leaderboard = buildLeaderboard(
    players ?? [],
    stats ?? [],
    scoring
  );

    const playerGamesPlayed = new Map<number, number>();
      (rosters ?? []).forEach((roster) => {
        const playerId = Number(
          roster.player_id
        );

        playerGamesPlayed.set(
          playerId,
          (playerGamesPlayed.get(playerId) ?? 0) + 1
        );
      });

    const leaderboardWithAverage = leaderboard.map(
      (player) => {
        const gamesPlayed =
          playerGamesPlayed.get(
            Number(player.id)
          ) ?? 0;

        return {
          ...player,
          gamesPlayed,
          avgPoints:
            gamesPlayed > 0
              ? player.points / gamesPlayed
              : 0,
        };
      }
    );

    console.log(
  leaderboardWithAverage.slice(0, 5)
);

console.log(
  "Roster IDs",
  rosters?.slice(0, 5)
);

console.log(
  "Leaderboard IDs",
  leaderboard.slice(0, 5)
);

 // ---------------------------
// Homepage Awards
// ---------------------------

const { data: votingGame } = await supabase
  .from("games")
  .select("id, name")
  .eq("voting_open", true)
  .single();

const latestGameId =
  votingGame?.id ?? 0;

const latestGameName =
  votingGame?.name ?? `Game ${latestGameId}`;

const { data: ballots } = await supabase
  .from("ballots")
  .select("id")
  .eq("game_id", latestGameId);

const ballotIds =
  ballots?.map((b) => b.id) ?? [];

const { data: votes } = await supabase
  .from("ballot_votes")
  .select("*")
  .in("ballot_id", ballotIds);

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

  const winners = [...counts.values()];

  const maxVotes = Math.max(
    ...winners.map(
      (entry) => entry.votes
    ),
    0
  );

  return winners.filter(
    (entry) => entry.votes === maxVotes
  );
}

const goatWinners =
  getWinners("goat");

const workerWinners =
  getWinners("hardest_worker");

const defenseWinners =
  getWinners(
    "unstoppable_defense"
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-10">
          <Image
            src="/icon.png"
            alt="JCU Logo"
            width={220}
            height={220}
            className="mx-auto mb-6"
          />

          <h1 className="text-5xl font-bold text-red-500">
            Jefferson County United
          </h1>

          <h2 className="text-2xl mt-4">
            JCU U9/U10 Soccer Fantasy
          </h2>

          <h3 className="text-2xl mt-4">
            Lake Mills Team
          </h3>

        </div>

        <div className="bg-zinc-900 rounded-xl p-6 shadow-lg">
          <h4 className="text-2xl font-bold mb-4">
            🏆 Current Leaderboard
          </h4>

          {error && (
            <p className="text-red-500 mb-4">
              Error loading players: {error.message}
            </p>
          )}

          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-3">Rank</th>
                <th className="text-left py-3">Player</th>
                <th className="text-right py-3">
                  Points
                </th>

                <th className="text-right py-3">
                  GP
                </th>

                <th className="text-right py-3">
                  Avg
                </th>
              </tr>
            </thead>

            <tbody>
              {leaderboardWithAverage.map(
               (player, index) => (
                <tr
                  key={player.id}
                  className="border-b border-zinc-800"
                >
                  <td className="py-3">
                    {index + 1}
                  </td>

                  <td className="py-3">
                    <Link
                      href={`/players/${player.id}`}
                      className="hover:text-blue-400 hover:underline"
                    >
                      {player.name}
                    </Link>
                  </td>

                  <td className="py-3 text-right">
                    {player.points}
                  </td>

                  <td className="py-3 text-right">
                    {player.gamesPlayed}
                  </td>

                  <td className="py-3 text-right">
                    {player.avgPoints.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

<Link href="/awards">
  <div className="mt-8 mb-4">
    <h2 className="text-xl font-bold">
      🥇 Latest Award Winners
    </h2>

    <p className="text-sm text-blue-400 mt-1">
      View Full Awards Results →
    </p>

     <p className="text-zinc-400 mt-4 font-bold">
      {latestGameName} ~ Voting Results
    </p>

  </div>

  <div className="grid md:grid-cols-3 gap-4 mt-8 cursor-pointer">
  <div className="bg-zinc-900 rounded-xl p-5">
    <h3 className="font-bold text-yellow-400">
      🏆 GOAT
    </h3>

    {goatWinners?.length ? (
  <>
    <div className="mt-2 text-xl font-semibold">
      {goatWinners.map((player) => (
        <div key={player.name}>
          {player.name}
        </div>
      ))}
    </div>

    <p className="text-zinc-400">
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
  <p className="mt-2 text-xl font-semibold">
    No votes yet
  </p>
)}
  </div>

  <div className="bg-zinc-900 rounded-xl p-5">
    <h3 className="font-bold text-orange-400">
      🔥 Hardest Worker
    </h3>

    {workerWinners?.length ? (
  <>
    <div className="mt-2 text-xl font-semibold">
      {workerWinners.map((player) => (
        <div key={player.name}>
          {player.name}
        </div>
      ))}
    </div>

    <p className="text-zinc-400">
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
  <p className="mt-2 text-xl font-semibold">
    No votes yet
  </p>
)}
  </div>

  <div className="bg-zinc-900 rounded-xl p-5">
    <h3 className="font-bold text-blue-400">
      🛡️ Unstoppable Defense
    </h3>

    {defenseWinners?.length ? (
  <>
    <div className="mt-2 text-xl font-semibold">
      {defenseWinners.map((player) => (
        <div key={player.name}>
          {player.name}
        </div>
      ))}
    </div>

    <p className="text-zinc-400">
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
  <p className="mt-2 text-xl font-semibold">
    No votes yet
  </p>
)}
  </div>
</div>
</Link>
        <div className="mt-8">
          <Link href="/games">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">
                ⚽ Games
              </h2>

              <p className="text-sm text-blue-400 mt-1">
                View Full Game Archive →
              </p>
            </div>
          </Link>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {games.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800 transition"
                >
                  <div className="text-lg font-semibold">
                    {game.name}
                  </div>
                </Link>
              ))}
                
          </div>

          <div className="mt-8">
            <Link href="/info">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">
                  📚 Soccer Information
                </h2>

                <p className="text-sm text-blue-400 mt-1">
                  Learn Rules, Terminology & Field Positions →
                </p>
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 hover:bg-zinc-800 transition">
                <p className="text-zinc-300">
                  New to soccer? Learn common rules like offsides,
                  build-out lines, goal kicks, corner kicks, throw-ins,
                  handballs, and more.
                </p>
              </div>
            </Link>
          </div>

          <div className="flex justify-end mt-8">
            <Link
              href="/admin"
              className="bg-zinc-600 hover:bg-red-600 px-4 py-2 rounded"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}