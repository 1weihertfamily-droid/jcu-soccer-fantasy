import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(
  request: Request
) {
  try {
    const { games } =
      await request.json();

    if (!Array.isArray(games)) {
      return NextResponse.json(
        {
          error:
            "Games array is required",
        },
        { status: 400 }
      );
    }

    for (const game of games) {
      const { error } =
        await supabaseAdmin
          .from("games")
          .update({
            name: game.name,
            active: game.active,
            voting_open:
              game.voting_open,
          })
          .eq("id", game.id);

      if (error) {
        return NextResponse.json(
          {
            error:
              error.message,
          },
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
        error:
          "Failed to save games",
      },
      { status: 500 }
    );
  }
}