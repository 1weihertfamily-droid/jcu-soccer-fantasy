import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function PlayerProfilesAdminPage() {
  const { data: players } = await supabase
    .from("players")
    .select("*")
    .eq("active", true)
    .order("name");

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Player Profile Preview
          </h1>

          <Link
            href="/admin"
            className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-zinc-900 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left p-4">
                  Player
                </th>

                <th className="text-center p-4">
                  Preview
                </th>
              </tr>
            </thead>

            <tbody>
              {players?.map((player) => (
                <tr
                  key={player.id}
                  className="border-b border-zinc-800"
                >
                  <td className="p-4">
                    {player.name}
                  </td>

                  <td className="p-4 text-center">
                    <Link
                      href={`/players/${player.id}`}
                      target="_blank"
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
                    >
                      Open Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}