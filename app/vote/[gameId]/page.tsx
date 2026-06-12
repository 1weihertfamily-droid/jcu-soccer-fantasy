import Link from "next/link";
import { supabase } from "@/lib/supabase";
import VoteForm from "@/components/VoteForm";
import HomeButton from "@/components/HomeButton";

type Props = {
  params: Promise<{
    gameId: string;
  }>;
};

export default async function VotePage({
  params,
}: Props) {
  const { gameId } = await params;

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("id", Number(gameId))
    .single();

  const { data: players } = await supabase
    .from("players")
    .select("id,name")
    .eq("active", true)
    .order("name");

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="mb-6">
            <HomeButton />
            </div>
      <h1 className="text-4xl font-bold mb-2">
        Parent Voting
      </h1>

      <h2 className="text-xl mb-8 text-zinc-400">
        {game?.name}
      </h2>

      <VoteForm
        gameId={Number(gameId)}
        players={players ?? []}
      />
    </main>
  );
}