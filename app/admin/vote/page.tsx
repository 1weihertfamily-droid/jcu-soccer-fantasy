import { supabase } from "@/lib/supabase";
import AdminDashboardButton from "@/components/AdminDashboardButton";
import AdminVoteTester from "@/components/AdminVoteTester";

export default async function AdminVotePage() {
  const seasonRes = await supabase
    .from("seasons")
    .select("id, name")
    .eq("active", true)
    .single();

  const season = seasonRes.data;

  const { data: games } = await supabase
    .from("games")
    .select("id,name")
    .eq("season_id", season?.id ?? -1)
    .order("display_order", { ascending: true });

  const { data: players } = await supabase
    .from("players")
    .select("id,name")
    .eq("active", true)
    .eq("season_id", season?.id ?? -1)
    .order("name");

  const { data: awardSettings } = await supabase
    .from("award_settings")
    .select("category,max_per_season");

  const settings = Object.fromEntries(
    (awardSettings ?? []).map((row: any) => [
      row.category,
      row.max_per_season,
    ])
  );

  const { data: awardWinners } = await supabase
    .from("award_winners")
    .select("player_id,category")
    .eq("season_id", season?.id ?? -1);

  const awardCounts = {
    goat: new Map<number, number>(),
    hardest_worker: new Map<number, number>(),
    unstoppable_defense: new Map<number, number>(),
  };

  (awardWinners ?? []).forEach((award: any) => {
    const map = awardCounts[award.category as keyof typeof awardCounts];
    if (!map) return;
    map.set(award.player_id, (map.get(award.player_id) ?? 0) + 1);
  });

  const selectedGame = games?.[0] ?? null;

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Admin Vote Tester
            </h1>
            <p className="text-zinc-400 mt-2 max-w-2xl">
              Submit test ballots as an administrator. Use a custom voter ID to send multiple ballots, or override an existing ballot when you need to replace a vote.
            </p>
          </div>
          <AdminDashboardButton />
        </div>

        {selectedGame ? (
          <AdminVoteTester
            games={games ?? []}
            players={players ?? []}
            awardCounts={awardCounts}
            awardLimits={settings}
          />
        ) : (
          <div className="bg-zinc-900 rounded-xl p-6 text-zinc-300">
            No active season or no games found. Create games in the admin dashboard first.
          </div>
        )}
      </div>
    </main>
  );
}
