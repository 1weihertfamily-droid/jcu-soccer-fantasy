export function calculateFantasyPoints(
  stat: any,
  scoring: Record<string, number>
): number {
  return (
    (stat.goals ?? 0) * (scoring["Goal"] ?? 0) +
    (stat.assists ?? 0) * (scoring["Assist"] ?? 0) +
    (stat.defensive_stops ?? 0) * (scoring["Defensive Stop"] ?? 0) +
    (stat.goal_saves ?? 0) * (scoring["Goal Save"] ?? 0) +
    (stat.great_passes ?? 0) * (scoring["Great Pass"] ?? 0) +
    (stat.hustle_plays ?? 0) * (scoring["Hustle Play"] ?? 0) +
    (stat.positive_attitude ?? 0) * (scoring["Positive Attitude"] ?? 0) +
    (stat.good_sportsmanship ?? 0) * (scoring["Good Sportsmanship"] ?? 0) +
    (stat.penalties ?? 0) * (scoring["Penalty"] ?? 0) +
    (stat.yellow_cards ?? 0) * (scoring["Yellow Card"] ?? 0) +
    (stat.red_cards ?? 0) * (scoring["Red Card"] ?? 0)
  );
}