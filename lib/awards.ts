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

async function calculateCategory(
  gameId: number,
  category: AwardCategory
): Promise<AwardWinner[]> {
  const { data: ballots } = await supabase
    .from("ballots")
    .select("id")
    .eq("game_id", gameId);

  const ballotIds = ballots?.map((b) => b.id) ?? [];

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

  const counts = new Map<number, AwardWinner>();

  for (const vote of votes ?? []) {
    const playerId = vote.player_id;

    const playerName =
      (vote.players as any)?.name ??
      "Unknown Player";

    const existing = counts.get(playerId);

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

  return Array.from(counts.values()).sort(
    (a, b) => b.votes - a.votes
  );
}

export async function getGameAwards(
  gameId: number
) {
  return {
    goat: await calculateCategory(
      gameId,
      "goat"
    ),

    hardest_worker:
      await calculateCategory(
        gameId,
        "hardest_worker"
      ),

    unstoppable_defense:
      await calculateCategory(
        gameId,
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

export async function getSeasonAwards(
  seasonId: number
) {
  const { data } = await supabase
    .from("award_winners")
    .select(`
      category,
      votes,
      player_id,
      players(name)
    `)
    .eq("season_id", seasonId);

  const categories = {
    goat: [] as AwardWinner[],
    hardest_worker:
      [] as AwardWinner[],
    unstoppable_defense:
      [] as AwardWinner[],
  };

  const grouped = new Map<
    string,
    Map<number, AwardWinner>
  >();

  grouped.set("goat", new Map());
  grouped.set(
    "hardest_worker",
    new Map()
  );
  grouped.set(
    "unstoppable_defense",
    new Map()
  );

  for (const row of data ?? []) {
    const map = grouped.get(
      row.category
    );

    if (!map) continue;

    const existing = map.get(
      row.player_id
    );

    const name =
      (row.players as any)?.name ??
      "Unknown Player";

    if (existing) {
      existing.votes +=
        row.votes ?? 0;
    } else {
      map.set(row.player_id, {
        player_id: row.player_id,
        name,
        votes: row.votes ?? 0,
      });
    }
  }

  for (const category of [
    "goat",
    "hardest_worker",
    "unstoppable_defense",
  ] as const) {
    categories[category] = Array.from(
      grouped
        .get(category)
        ?.values() ?? []
    ).sort(
      (a, b) => b.votes - a.votes
    );
  }

  return categories;
}

/**
 * Returns every player tied for first.
 */
export function getWinningPlayers(
  players: AwardWinner[]
): AwardWinner[] {
  if (!players.length) return [];

  const highestVotes =
    players[0].votes;

  return players.filter(
    (p) => p.votes === highestVotes
  );
}

/**
 * Returns only the winners for a game.
 * Both the Home page and Game page should call this.
 */
export async function getWinningGameAwards(
  gameId: number
) {
  const awards =
    await getGameAwards(gameId);

  return {
    goat: getWinningPlayers(
      awards.goat
    ),

    hardest_worker:
      getWinningPlayers(
        awards.hardest_worker
      ),

    unstoppable_defense:
      getWinningPlayers(
        awards.unstoppable_defense
      ),
  };
}

export type PlayerAwardVoteCounts = {
  goat: number;
  hardest_worker: number;
  unstoppable_defense: number;
};

export async function getPlayerAwardVoteCounts(
  playerId: number
): Promise<PlayerAwardVoteCounts> {
  const { data } = await supabase
    .from("ballot_votes")
    .select("category")
    .eq("player_id", playerId);

  const counts: PlayerAwardVoteCounts = {
    goat: 0,
    hardest_worker: 0,
    unstoppable_defense: 0,
  };

  (data ?? []).forEach((vote: any) => {
    if (vote.category === "goat") {
      counts.goat += 1;
    } else if (
      vote.category === "hardest_worker"
    ) {
      counts.hardest_worker += 1;
    } else if (
      vote.category === "unstoppable_defense"
    ) {
      counts.unstoppable_defense += 1;
    }
  });

  return counts;
}

/**
 * Used by the Home page.
 */
export async function getLatestAwards() {
  const { data: latestGame } =
    await supabase
      .from("games")
      .select("id, name")
      .order("game_date", {
        ascending: false,
      })
      .limit(1)
      .single();

  if (!latestGame) {
    return {
      latestGameName: null,
      goat: [],
      hardest_worker: [],
      unstoppable_defense: [],
    };
  }

  const awards =
    await getWinningGameAwards(
      latestGame.id
    );

  return {
    latestGameName:
      latestGame.name,
    ...awards,
  };
}