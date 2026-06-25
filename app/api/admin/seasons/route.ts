import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data } =
    await supabaseAdmin
      .from("seasons")
      .select("*")
      .order("id");

  return NextResponse.json(data);
}

export async function POST(
  request: Request
) {
  const { name } =
    await request.json();

  await supabaseAdmin
    .from("seasons")
    .insert({
      name,
      active: false,
    });

  return NextResponse.json({
    success: true,
  });
}

export async function PATCH(
  request: Request
) {
  const { seasonId } =
    await request.json();

  await supabaseAdmin
    .from("seasons")
    .update({
      active: false,
    })
    .neq("id", 0);

  await supabaseAdmin
    .from("seasons")
    .update({
      active: true,
    })
    .eq("id", seasonId);

  return NextResponse.json({
    success: true,
  });
}