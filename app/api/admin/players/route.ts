import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET ALL PLAYERS
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("players")
    .select("*")
    .order("name");

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
  const { name } = await request.json();

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
  } = {};

  if (typeof name === "string") {
    updates.name = name.trim();
  }

  if (typeof active === "boolean") {
    updates.active = active;
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