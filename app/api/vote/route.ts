import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const {
      gameId,
      voterId,
      voterName,
      goatVotes,
      hardestWorkerVotes,
      unstoppableDefenseVotes,
    } = await req.json();

    console.log("VOTE REQUEST:", {
      gameId,
      voterId,
      voterName,
      goatVotes,
      hardestWorkerVotes,
      unstoppableDefenseVotes,
    });
console.log("VOTER ID RECEIVED:", voterId);
    const allSelections = [
      ...goatVotes,
      ...hardestWorkerVotes,
      ...unstoppableDefenseVotes,
    ];

    const uniqueSelections =
      new Set(allSelections);

    if (
      uniqueSelections.size !==
      allSelections.length
    ) {
      return NextResponse.json(
        {
          error:
            "A player may only be selected once.",
        },
        { status: 400 }
      );
    }

    const { data: existingVote } =
      await supabaseAdmin
        .from("ballots")
        .select("id")
        .eq("game_id", gameId)
        .eq("voter_id", voterId)
        .single();

    if (existingVote) {
      return NextResponse.json(
        {
          error:
            "You have already voted for this game.",
        },
        { status: 400 }
      );
    }

console.log({
  game_id: gameId,
  voter_id: voterId,
  voter_name: voterName,
});

    const {
      data: ballot,
      error: ballotError,
    } = await supabaseAdmin
      .from("ballots")
      .insert({
        game_id: gameId,
        voter_id: voterId,
        voter_name: voterName,
      })
      .select()
      .single();

    if (ballotError) {
      console.log(
        "BALLOT ERROR:",
        ballotError
      );

      return NextResponse.json(
        {
          error: ballotError.message,
          details: ballotError,
        },
        { status: 500 }
      );
    }

    const votes = [
      ...goatVotes.map(
        (playerId: number) => ({
          ballot_id: ballot.id,
          player_id: playerId,
          category: "goat",
        })
      ),

      ...hardestWorkerVotes.map(
        (playerId: number) => ({
          ballot_id: ballot.id,
          player_id: playerId,
          category:
            "hardest_worker",
        })
      ),

      ...unstoppableDefenseVotes.map(
        (playerId: number) => ({
          ballot_id: ballot.id,
          player_id: playerId,
          category:
            "unstoppable_defense",
        })
      ),
    ];

    const { error: voteError } =
      await supabaseAdmin
        .from("ballot_votes")
        .insert(votes);

    if (voteError) {
      console.log(
        "VOTE ERROR:",
        voteError
      );

      return NextResponse.json(
        {
          error: voteError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Failed to save vote.",
      },
      {
        status: 500,
      }
    );
  }
}