import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { gameId } = await request.json();

    if (!gameId) {
      return NextResponse.json(
        { error: "Missing gameId" },
        { status: 400 }
      );
    }

    // Get all ballots for this game
    const { data: ballots, error: ballotError } =
      await supabaseAdmin
        .from("ballots")
        .select("id")
        .eq("game_id", gameId);

    if (ballotError) {
      console.error(ballotError);

      return NextResponse.json(
        { error: ballotError.message },
        { status: 500 }
      );
    }

    const ballotIds =
      ballots?.map((b) => b.id) ?? [];

    console.log(
      `Found ${ballotIds.length} ballots for game ${gameId}`
    );

    // Delete votes first
    if (ballotIds.length > 0) {
      const {
        error: voteDeleteError,
        count: voteCount,
      } = await supabaseAdmin
        .from("ballot_votes")
        .delete({ count: "exact" })
        .in("ballot_id", ballotIds);

      if (voteDeleteError) {
        console.error(voteDeleteError);

        return NextResponse.json(
          { error: voteDeleteError.message },
          { status: 500 }
        );
      }

      console.log(
        `Deleted ${voteCount ?? 0} votes`
      );
    }

    // Delete ballots
    const {
      error: ballotDeleteError,
      count: ballotCount,
    } = await supabaseAdmin
      .from("ballots")
      .delete({ count: "exact" })
      .eq("game_id", gameId);

    if (ballotDeleteError) {
      console.error(ballotDeleteError);

      return NextResponse.json(
        { error: ballotDeleteError.message },
        { status: 500 }
      );
    }

    console.log(
      `Deleted ${ballotCount ?? 0} ballots`
    );

    return NextResponse.json({
      success: true,
      deletedBallots: ballotCount ?? 0,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err?.message ??
          "Failed to reset voting",
      },
      { status: 500 }
    );
  }
}