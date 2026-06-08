import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { game_id, rows } = body;

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

    const { error } = await supabase
      .from("player_stats")
      .upsert(rowsToSave, {
        onConflict: "game_id,player_id",
      });

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to save stats" },
      { status: 500 }
    );
  }
}