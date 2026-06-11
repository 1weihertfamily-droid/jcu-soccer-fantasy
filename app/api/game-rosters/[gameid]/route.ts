import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      gameid: string;
    }>;
  }
) {
  const { gameid } =
    await params;

  const { data, error } =
    await supabaseAdmin
      .from("game_rosters")
      .select("player_id")
      .eq(
        "game_id",
        Number(gameid)
      );

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(
    data ?? []
  );
}