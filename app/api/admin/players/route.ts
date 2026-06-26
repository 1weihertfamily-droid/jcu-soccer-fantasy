import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET ALL PLAYERS
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const seasonId = searchParams.get("seasonId");

  let query = supabaseAdmin
    .from("players")
    .select("*")
    .order("name");

  if (seasonId) {
    query = query.eq(
      "season_id",
      Number(seasonId)
    );
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

// ADD PLAYER
export async function POST(
  request: Request
) {
  const { name, season_id } = await request.json();

  if (!name?.trim()) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const { data, error } =
    await supabaseAdmin
      .from("players")
      .insert([
        {
          name: name.trim(),
          active: true,
          season_id: season_id,
        },
      ])
      .select()
      .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

// UPDATE PLAYER
export async function PATCH(
  request: Request
) {
  const {
    id,
    name,
    active,
    season_id
  } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: "Player ID required" },
      { status: 400 }
    );
  }

  const updates: {
    name?: string;
    active?: boolean;
    season_id?: number | null;
  } = {};

  if (typeof name === "string") {
    updates.name = name.trim();
  }

  if (typeof active === "boolean") {
    updates.active = active;
  }

  if (
    typeof season_id === "number" ||
    season_id === null
  ) {
    updates.season_id = season_id;
  }

  const { data, error } =
    await supabaseAdmin
      .from("players")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}