import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET GAMES
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const seasonId = searchParams.get("seasonId");

  let query = supabaseAdmin
    .from("games")
    .select("*")
    .order("display_order", { ascending: true });

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

// ADD GAME
export async function POST(
  request: Request
) {
  const {
    name,
    game_date,
    display_order,
    season_id,
  } = await request.json();

  if (!name?.trim()) {
    return NextResponse.json(
      { error: "Game name is required" },
      { status: 400 }
    );
  }

  const { data, error } =
    await supabaseAdmin
      .from("games")
      .insert([
        {
          name: name.trim(),
          game_date:
            game_date === ""
              ? null
              : game_date,
          active: true,
          voting_open: true,
          display_order:
            display_order ?? 999,
          season_id,
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

// UPDATE GAME
export async function PATCH(
  request: Request
) {
  const {
    id,
    name,
    active,
    voting_open,
    display_order,
    season_id,
  } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: "Game ID required" },
      { status: 400 }
    );
  }

  const updates: {
    name?: string;
    active?: boolean;
    voting_open?: boolean;
    display_order?: number;
    season_id?: number | null;
  } = {};

  if (typeof name === "string") {
    updates.name = name.trim();
  }

  if (typeof active === "boolean") {
    updates.active = active;
  }

  if (
    typeof voting_open === "boolean"
  ) {
    updates.voting_open =
      voting_open;
  }

  if (
    typeof display_order ===
    "number"
  ) {
    updates.display_order =
      display_order;
  }

  if (season_id !== undefined) {
    updates.season_id = season_id;
  }

  const { data, error } =
    await supabaseAdmin
      .from("games")
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