type PlayerOption = {
  id: string | number;
  name: string;
};

type AwardsFiltersProps = {
  games: Array<{ gameId: string }>;
  players: PlayerOption[];
  selectedGame: string;
  selectedPlayer: string;
  selectedCategory: string;
  onGameChange: (value: string) => void;
  onPlayerChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
};

export default function AwardsFilters({
  games,
  players,
  selectedGame,
  selectedPlayer,
  selectedCategory,
  onGameChange,
  onPlayerChange,
  onCategoryChange,
}: AwardsFiltersProps) {
  return (
    <div className="bg-zinc-900 rounded-xl p-5 mb-8">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Game</label>
          <select
            value={selectedGame}
            onChange={(e) => onGameChange(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded p-3"
          >
            <option value="all">All Games</option>
            {games.map((game) => (
              <option key={game.gameId} value={String(game.gameId)}>
                Game {game.gameId}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">Player</label>
          <select
            value={selectedPlayer}
            onChange={(e) => onPlayerChange(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded p-3"
          >
            <option value="all">All Players</option>
            {players.map((player) => (
              <option key={String(player.id)} value={String(player.id)}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded p-3"
          >
            <option value="all">All Categories</option>
            <option value="goat">GOAT</option>
            <option value="worker">Hardest Worker</option>
            <option value="defense">Unstoppable Defense</option>
          </select>
        </div>
      </div>
    </div>
  );
}
