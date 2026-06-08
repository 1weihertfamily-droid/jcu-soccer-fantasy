import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ gameid: string }> }
) {
  const { gameid } = await params;

  const { data, error } = await supabase
    .from("player_stats")
    .select("*")
    .eq("game_id", Number(gameid));

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}