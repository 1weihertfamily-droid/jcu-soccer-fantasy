import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const gameId =
    searchParams.get("gameId");

  const voterId =
    searchParams.get("voterId");

  if (!gameId || !voterId) {
    return NextResponse.json({
      alreadyVoted: false,
    });
  }

  const { data, error } =
    await supabaseAdmin
      .from("ballots")
      .select("id")
      .eq("game_id", Number(gameId))
      .eq("voter_id", voterId)
      .single();

  if (error) {
    console.error(
      "Vote check error:",
      error
    );

    return NextResponse.json({
      alreadyVoted: false,
    });
  }

  return NextResponse.json({
    alreadyVoted: !!data,
  });
}