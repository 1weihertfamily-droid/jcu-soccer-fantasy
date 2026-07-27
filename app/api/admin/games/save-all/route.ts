import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { saveGameAwards } from "@/lib/awards";

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
            game_date:
              game.game_date === ""
                ? null
                : game.game_date,
            active: game.active,
            voting_open:
              game.voting_open,
            game_complete:
              game.game_complete,
            display_order:
              game.display_order,
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

      if (game.game_complete === true) {
        await saveGameAwards(game.id);
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