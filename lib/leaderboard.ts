import { calculateFantasyPoints } from "./scoring";

export function buildLeaderboard(
  players: any[],
  stats: any[],
  scoring: Record<string, number>
) {
  return players
    .map((player) => {
      const playerStats = stats.filter(
        (s) => s.player_id === player.id
      );

      const totalPoints = playerStats.reduce(
        (sum, stat) =>
          sum + calculateFantasyPoints(stat, scoring),
        0
      );

      return {
        id: player.id,
        name: player.name,
        points: totalPoints,
      };
    })
    .sort((a, b) => b.points - a.points);
}