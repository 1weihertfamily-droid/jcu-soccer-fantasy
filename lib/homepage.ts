import { supabase } from "@/lib/supabase";
import { buildLeaderboard } from "@/lib/leaderboard";
import { getActiveSeason } from "@/lib/season";

type HomePageAwardWinner = {
  name: string;
  votes: number;
};

export type HomePageData = {
  games: any[];
  leaderboardWithAverage: any[];
  latestGameName: string;
  awardWinners: {
    goat: HomePageAwardWinner[];
    hardest_worker: HomePageAwardWinner[];
    unstoppable_defense: HomePageAwardWinner[];
  };
  playersErrorMessage?: string;
};

export async function getHomePageData(): Promise<HomePageData> {
  const season = await getActiveSeason();

  const [
    { data: activeGames },
    { data: players, error: playersError },
    { data: stats },
    { data: rosters },
    { data: scoringRows },
  ] = await Promise.all([
    supabase
      .from("games")
      .select("*")
      .eq("active", true)
      .eq("season_id", season.id)
      .order("display_order"),

    supabase
      .from("players")
      .select("*")
      .eq("active", true)
      .eq("season_id", season.id)
      .order("name"),

    supabase
      .from("player_stats")
      .select(`
        *,
        games!inner(
          id,
          season_id
        )
      `)
      .eq("games.season_id", season.id),

    supabase
      .from("game_rosters")
      .select("*")
      .eq("season_id", season.id),

    supabase.from("fantasy_points_values").select("*"),
  ]);

  const { data: votingGame } = await supabase
    .from("games")
    .select("id, name")
    .eq("season_id", season.id)
    .eq("voting_open", true)
    .single();

  const latestGameId = votingGame?.id ?? 0;
  const latestGameName = votingGame?.name ?? `Game ${latestGameId}`;

  const { data: ballots } = await supabase
    .from("ballots")
    .select("id")
    .eq("game_id", latestGameId);

  const ballotIds = ballots?.map((ballot: any) => ballot.id) ?? [];

  const { data: votes } =
    ballotIds.length > 0
      ? await supabase
          .from("ballot_votes")
          .select("*")
          .in("ballot_id", ballotIds)
      : { data: [] };

  const games = activeGames ?? [];
  const scoring = Object.fromEntries(
    (scoringRows ?? []).map((row: any) => [row.action, Number(row.value)])
  );

  const leaderboard = buildLeaderboard(players ?? [], stats ?? [], scoring);

  const playerGamesPlayed = new Map<number, number>();
  (rosters ?? []).forEach((roster: any) => {
    const playerId = Number(roster.player_id);
    playerGamesPlayed.set(
      playerId,
      (playerGamesPlayed.get(playerId) ?? 0) + 1
    );
  });

  const leaderboardWithAverage = leaderboard.map((player: any) => {
    const gamesPlayed = playerGamesPlayed.get(Number(player.id)) ?? 0;

    return {
      ...player,
      gamesPlayed,
      avgPoints: gamesPlayed > 0 ? player.points / gamesPlayed : 0,
    };
  });

  const playerMap = new Map(
    (players ?? []).map((player: any) => [player.id, player.name])
  );

  function getWinners(category: string) {
    const categoryVotes = (votes ?? []).filter((vote: any) => vote.category === category);
    const counts = new Map<number, HomePageAwardWinner & { votes: number }>();

    categoryVotes.forEach((vote: any) => {
      const existing = counts.get(vote.player_id);

      if (existing) {
        existing.votes += 1;
      } else {
        counts.set(vote.player_id, {
          name: playerMap.get(vote.player_id) ?? "Unknown Player",
          votes: 1,
        });
      }
    });

    const winners = Array.from(counts.values());
    const maxVotes = Math.max(...winners.map((entry) => entry.votes), 0);

    return winners.filter((entry) => entry.votes === maxVotes);
  }

  return {
    games,
    leaderboardWithAverage,
    latestGameName,
    awardWinners: {
      goat: getWinners("goat"),
      hardest_worker: getWinners("hardest_worker"),
      unstoppable_defense: getWinners("unstoppable_defense"),
    },
    playersErrorMessage: playersError?.message,
  };
}
