import Image from "next/image";
import Link from "next/link";
import WelcomePopup from "@/components/WelcomePopup";
import { getHomePageData } from "@/lib/homepage";
import { getLatestAwards } from "@/lib/awards";

export const dynamic = "force-dynamic";

export default async function Home() {
  const {
    games,
    leaderboardWithAverage,
    playersErrorMessage,
  } = await getHomePageData();

  const {
    latestGameName,
    goat,
    hardest_worker,
    unstoppable_defense,
  } = await getLatestAwards();

  return (
    <main className="min-h-screen bg-black text-white">
      <WelcomePopup />
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

          {playersErrorMessage && (
            <p className="text-red-500 mb-4">
              Error loading players: {playersErrorMessage}
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
      {latestGameName ?? "Latest Game"} ~ Voting Results
    </p>

  </div>

  <div className="grid md:grid-cols-3 gap-4 mt-8 cursor-pointer">
  <div className="bg-zinc-900 rounded-xl p-5">
    <h3 className="font-bold text-yellow-400">
      🏆 GOAT
    </h3>

    {goat?.length ? (
  <>
    <div className="mt-2 text-xl font-semibold">
      {goat.map((player) => (
        <div key={player.name}>
          {player.name}
        </div>
      ))}
    </div>

    <p className="text-zinc-400">
      {goat.length > 1
        ? `🏅 Tied • ${goat[0].votes} votes each`
        : `${goat[0].votes} vote${
            goat[0].votes !== 1
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

    {hardest_worker?.length ? (
  <>
    <div className="mt-2 text-xl font-semibold">
      {hardest_worker.map((player) => (
        <div key={player.name}>
          {player.name}
        </div>
      ))}
    </div>

    <p className="text-zinc-400">
      {hardest_worker.length > 1
        ? `🏅 Tied • ${hardest_worker[0].votes} votes each`
        : `${hardest_worker[0].votes} vote${

            hardest_worker[0].votes !== 1
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

    {unstoppable_defense?.length ? (
  <>
    <div className="mt-2 text-xl font-semibold">
      {unstoppable_defense.map((player) => (
        <div key={player.name}>
          {player.name}
        </div>
      ))}
    </div>

    <p className="text-zinc-400">
      {unstoppable_defense.length > 1
        ? `🏅 Tied • ${unstoppable_defense[0].votes} votes each`
        : `${unstoppable_defense[0].votes} vote${
            unstoppable_defense[0].votes !== 1
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

                  {game.game_date && (
                    <div className="text-sm text-zinc-400 mt-1">
                      {new Date(game.game_date).toLocaleDateString()}
                    </div>
                  )}
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

          <div className="mt-8">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">
                  🔗 Links
                </h2>
                
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 hover:bg-zinc-800 transition flex flex-wrap gap-4">
                <a
                  href="https://playmetrics.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
                >
                  Open PlayMetrics
                </a>

                <a
                  href="https://www.jeffersoncountyunited.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
                >
                  Open JCU ⚽
                </a>

              </div>
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