import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      game_id,
      rows,
      roster,
    } = body;

    const rowsToSave = rows.map((row: any) => ({
      game_id: Number(game_id),
      player_id: row.player_id,

      goals: row.goals,
      assists: row.assists,
      defensive_stops: row.defensive_stops,
      goal_saves: row.goal_saves,
      great_passes: row.great_passes,
      hustle_plays: row.hustle_plays,
      positive_attitude: row.positive_attitude,
      good_sportsmanship: row.good_sportsmanship,
      penalties: row.penalties,
      yellow_cards: row.yellow_cards,
      red_cards: row.red_cards,
    }));

    const { error: statsError } =
      await supabaseAdmin
        .from("player_stats")
        .upsert(rowsToSave, {
          onConflict:
            "game_id,player_id",
        });

    if (statsError) {
      console.error(statsError);

      return NextResponse.json(
        { error: statsError.message },
        { status: 500 }
      );
    }

    // ---------------------------------
    // Save roster
    // ---------------------------------

    if (Array.isArray(roster)) {
      const { error: deleteError } =
        await supabaseAdmin
          .from("game_rosters")
          .delete()
          .eq(
            "game_id",
            Number(game_id)
          );

      if (deleteError) {
        console.error(deleteError);

        return NextResponse.json(
          {
            error:
              deleteError.message,
          },
          { status: 500 }
        );
      }

      if (roster.length > 0) {
        const rosterRows =
          roster.map(
            (playerId: number) => ({
              game_id:
                Number(game_id),
              player_id: playerId,
            })
          );

        const {
          error: rosterError,
        } = await supabaseAdmin
          .from("game_rosters")
          .insert(rosterRows);

        if (rosterError) {
          console.error(
            rosterError
          );

          return NextResponse.json(
            {
              error:
                rosterError.message,
            },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          "Failed to save stats",
      },
      { status: 500 }
    );
  }
}