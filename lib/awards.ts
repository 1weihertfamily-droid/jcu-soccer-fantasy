import { supabase } from "@/lib/supabase";

export const MAX_AWARDS_PER_CATEGORY = 2;

export type AwardCategory =
  | "goat"
  | "hardest_worker"
  | "unstoppable_defense";

export type AwardWinner = {
  player_id: number;
  name: string;
  votes: number;
};

export async function getGameAwards(gameId: number) {
  const { data: game } = await supabase
    .from("games")
    .select("season_id")
    .eq("id", gameId)
    .single();

  if (!game) {
    throw new Error("Game not found.");
  }

  async function calculateCategory(
    category: AwardCategory
  ): Promise<AwardWinner[]> {
    const { data: ballots } = await supabase
      .from("ballots")
      .select("id")
      .eq("game_id", gameId);

    const ballotIds =
      ballots?.map((b) => b.id) ?? [];

    if (!ballotIds.length) {
      return [];
    }

    const { data: votes } = await supabase
      .from("ballot_votes")
      .select(`
        player_id,
        players(name)
      `)
      .eq("category", category)
      .in("ballot_id", ballotIds);

    const counts = new Map<
      number,
      AwardWinner
    >();

    for (const vote of votes ?? []) {
      const playerId = vote.player_id;

      const playerName =
        (vote.players as any)?.name ??
        "Unknown Player";

      const existing =
        counts.get(playerId);

      if (existing) {
        existing.votes++;
      } else {
        counts.set(playerId, {
          player_id: playerId,
          name: playerName,
          votes: 1,
        });
      }
    }

    return Array.from(
      counts.values()
    ).sort(
      (a, b) => b.votes - a.votes
    );
  }

  return {
    goat: await calculateCategory(
      "goat"
    ),

    hardest_worker:
      await calculateCategory(
        "hardest_worker"
      ),

    unstoppable_defense:
      await calculateCategory(
        "unstoppable_defense"
      ),
  };
}

export async function saveGameAwards(
  gameId: number
) {
  const { data: game } = await supabase
    .from("games")
    .select("season_id")
    .eq("id", gameId)
    .single();

  if (!game) return;

  const awards =
    await getGameAwards(gameId);

  await supabase
    .from("award_winners")
    .delete()
    .eq("game_id", gameId);

  const rows = [
    ...awards.goat.map((p) => ({
      season_id: game.season_id,
      game_id: gameId,
      category: "goat",
      player_id: p.player_id,
      votes: p.votes,
    })),

    ...awards.hardest_worker.map((p) => ({
      season_id: game.season_id,
      game_id: gameId,
      category: "hardest_worker",
      player_id: p.player_id,
      votes: p.votes,
    })),

    ...awards.unstoppable_defense.map(
      (p) => ({
        season_id: game.season_id,
        game_id: gameId,
        category:
          "unstoppable_defense",
        player_id: p.player_id,
        votes: p.votes,
      })
    ),
  ];

  if (rows.length) {
  await supabase
    .from("award_winners")
    .insert(rows);
}

return awards;
}