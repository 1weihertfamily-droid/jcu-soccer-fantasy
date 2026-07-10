import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json(
      { error: "Missing gameId" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("ballots")
    .select("id,voter_name,created_at,ballot_votes(player_id,category)")
    .eq("game_id", Number(gameId))
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load ballots:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const votes = (data ?? []).map((ballot: any) => {
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

    return {
      ballotId: ballot.id,
      voterName: ballot.voter_name,
      createdAt: ballot.created_at,
      goatVotes,
      hardestWorkerVotes,
      unstoppableDefenseVotes,
    };
  });

  return NextResponse.json({ votes });
}

export async function DELETE(request: Request) {
  try {
    const { ballotId } = await request.json();

    if (!ballotId) {
      return NextResponse.json(
        { error: "Missing ballotId" },
        { status: 400 }
      );
    }

    const { error: voteError } = await supabaseAdmin
      .from("ballot_votes")
      .delete()
      .eq("ballot_id", ballotId);

    if (voteError) {
      console.error("Failed to delete ballot votes:", voteError);
      return NextResponse.json(
        { error: voteError.message },
        { status: 500 }
      );
    }

    const { error: ballotError } = await supabaseAdmin
      .from("ballots")
      .delete()
      .eq("id", ballotId);

    if (ballotError) {
      console.error("Failed to delete ballot:", ballotError);
      return NextResponse.json(
        { error: ballotError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message || "Failed to reset vote" },
      { status: 500 }
    );
  }
}
