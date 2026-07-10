import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const gameId =
    searchParams.get("gameId");

  const voterId =
    searchParams.get("voterId");

  if (!gameId || !voterId) {
    return NextResponse.json({
      alreadyVoted: false,
    });
  }

  const { data: ballot, error } =
    await supabaseAdmin
      .from("ballots")
      .select("id,voter_name,ballot_votes(player_id,category)")
      .eq("game_id", Number(gameId))
      .eq("voter_id", voterId)
      .single();

  if (error) {
    console.error(
      "Vote check error:",
      error
    );

    return NextResponse.json({
      alreadyVoted: false,
    });
  }

  if (!ballot) {
    return NextResponse.json({
      alreadyVoted: false,
    });
  }

  const goatVotes: number[] = [];
  const hardestWorkerVotes: number[] = [];
  const unstoppableDefenseVotes: number[] = [];

  (ballot.ballot_votes ?? []).forEach((vote: any) => {
    if (vote.category === "goat") {
      goatVotes.push(vote.player_id);
    }
    if (vote.category === "hardest_worker") {
      hardestWorkerVotes.push(vote.player_id);
    }
    if (vote.category === "unstoppable_defense") {
      unstoppableDefenseVotes.push(vote.player_id);
    }
  });

  return NextResponse.json({
    alreadyVoted: true,
    voterName: ballot.voter_name,
    goatVotes,
    hardestWorkerVotes,
    unstoppableDefenseVotes,
  });
}