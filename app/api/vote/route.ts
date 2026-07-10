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
      forceOverride,
    } = await req.json();

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

    const { data: existingVotes, error: existingVoteError } =
      await supabaseAdmin
        .from("ballots")
        .select("id")
        .eq("game_id", gameId)
        .eq("voter_id", voterId);

    if (existingVoteError) {
      console.error(existingVoteError);
    }

    if (existingVotes && existingVotes.length > 0) {
      if (forceOverride) {
        const ballotIds = existingVotes.map(
          (ballot: any) => ballot.id
        );

        const { error: deleteVoteError } =
          await supabaseAdmin
            .from("ballot_votes")
            .delete()
            .in("ballot_id", ballotIds);

        if (deleteVoteError) {
          console.error(deleteVoteError);
          return NextResponse.json(
            {
              error:
                "Failed to remove existing ballot votes.",
            },
            { status: 500 }
          );
        }

        const { error: deleteBallotError } =
          await supabaseAdmin
            .from("ballots")
            .delete()
            .in("id", ballotIds);

        if (deleteBallotError) {
          console.error(deleteBallotError);
          return NextResponse.json(
            {
              error:
                "Failed to remove existing ballots.",
            },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          {
            error: "You have already voted for this game.",
          },
          { status: 400 }
        );
      }
    }

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
      console.error(
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
      console.error(
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