import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(
  request: Request
) {
  try {
    const { gameId } =
      await request.json();

    const { error } =
      await supabaseAdmin
        .from("player_stats")
        .delete()
        .eq("game_id", gameId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}