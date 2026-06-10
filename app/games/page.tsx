import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function GamesPage() {
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("id", { ascending: true });

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              ⚽ Game Archive
            </h1>

            <p className="text-zinc-400 mt-2">
              Browse stats, awards, and voting results from every game.
            </p>
          </div>

          <Link
            href="/"
            className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded"
          >
            ← Back Home
          </Link>
        </div>

        {!games?.length ? (
          <div className="bg-zinc-900 rounded-xl p-6">
            No games found.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="
                  bg-zinc-900
                  border border-zinc-800
                  rounded-xl
                  p-5
                  hover:bg-zinc-800
                  transition
                "
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold">
                    {game.name}
                  </h2>

                  {game.voting_open && (
                    <span className="bg-green-600 text-xs px-2 py-1 rounded">
                      Voting Open
                    </span>
                  )}
                </div>

                <p className="text-zinc-400">
                  Game #{game.id}
                </p>

                <div className="mt-4 text-blue-400 text-sm">
                  View Game Details →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}