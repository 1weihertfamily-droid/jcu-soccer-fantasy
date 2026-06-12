import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { scoring } = await request.json();

    for (const row of scoring) {
      const { error } = await supabaseAdmin
        .from("fantasy_points_values")
        .update({
          value: row.value,
        })
        .eq("id", row.id);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Failed to save scoring",
      },
      { status: 500 }
    );
  }
}