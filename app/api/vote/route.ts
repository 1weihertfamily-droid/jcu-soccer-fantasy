import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const {
      gameId,
      voterName,
      goat,
      hardestWorker,
      unstoppableDefense,
    } = await req.json();
        console.log("VOTE REQUEST:", {
        gameId,
        voterName,
        goat,
        hardestWorker,
        unstoppableDefense,
        });
    const selections = [
      goat,
      hardestWorker,
      unstoppableDefense,
    ];

    const uniqueSelections = new Set(selections);

    if (uniqueSelections.size !== 3) {
      return NextResponse.json(
        {
          error:
            "A player may only be selected once.",
        },
        { status: 400 }
      );
    }

    const { data: ballot, error: ballotError } =
      await supabaseAdmin
        .from("ballots")
        .insert({
          game_id: gameId,
          voter_name: voterName,
        })
        .select()
        .single();

    if (ballotError) {
        console.log("BALLOT ERROR:", ballotError);

        return NextResponse.json(
            {
            error: ballotError.message,
            details: ballotError,
            },
            { status: 500 }
        );
        }

    const { error: voteError } =
      await supabaseAdmin
        .from("ballot_votes")
        .insert([
          {
            ballot_id: ballot.id,
            player_id: goat,
            category: "goat",
          },
          {
            ballot_id: ballot.id,
            player_id: hardestWorker,
            category: "hardest_worker",
          },
          {
            ballot_id: ballot.id,
            player_id: unstoppableDefense,
            category: "unstoppable_defense",
          },
        ]);

    if (voteError) {
      return NextResponse.json(
        { error: voteError.message },
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