import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const seasonId = searchParams.get("seasonId");

  let query = supabaseAdmin
    .from("players")
    .select("*")
    .order("name");

  if (seasonId) {
    query = query.eq("season_id", Number(seasonId));
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}