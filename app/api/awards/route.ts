import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data: votes, error } =
      await supabaseAdmin
        .from("ballot_votes")
        .select(`
          category,
          player_id,
          players(name),
          ballots!inner(game_id),
          games:ballots(game_id)
        `);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const grouped: Record<string, any> = {};

    votes?.forEach((vote: any) => {
      const gameId =
        vote.ballots?.game_id;

      if (!grouped[gameId]) {
        grouped[gameId] = {
          goat: {},
          hardest_worker: {},
          unstoppable_defense: {},
        };
      }

      const category =
        vote.category;

      const playerId =
        vote.player_id;

      const playerName =
        vote.players?.name;

      if (
        !grouped[gameId][category][playerId]
      ) {
        grouped[gameId][category][playerId] =
          {
            playerId,
            playerName,
            votes: 0,
          };
      }

      grouped[gameId][category][playerId]
        .votes++;
    });

    const results = Object.entries(
      grouped
    ).map(([gameId, categories]) => ({
      gameId,
      goat: Object.values(
        (categories as any).goat
      )
        .sort(
          (a: any, b: any) =>
            b.votes - a.votes
        )
        .slice(0, 5),

      hardestWorker: Object.values(
        (categories as any)
          .hardest_worker
      )
        .sort(
          (a: any, b: any) =>
            b.votes - a.votes
        )
        .slice(0, 5),

      defense: Object.values(
        (categories as any)
          .unstoppable_defense
      )
        .sort(
          (a: any, b: any) =>
            b.votes - a.votes
        )
        .slice(0, 5),
    }));

    return NextResponse.json(
      results
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          "Failed to load awards.",
      },
      {
        status: 500,
      }
    );
  }
}