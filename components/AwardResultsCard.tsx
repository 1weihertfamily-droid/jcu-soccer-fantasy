import Link from "next/link";

type AwardPlayer = {
  playerName: string;
  playerId: string;
  votes: number;
};

type AwardResultsCardProps = {
  gameId: string;
  goat: AwardPlayer[];
  hardestWorker: AwardPlayer[];
  defense: AwardPlayer[];
  selectedCategory: string;
  selectedPlayer: string;
  renderPlayer: (player: AwardPlayer | undefined) => React.ReactNode;
};

export default function AwardResultsCard({
  gameId,
  goat,
  hardestWorker,
  defense,
  selectedCategory,
  selectedPlayer,
  renderPlayer,
}: AwardResultsCardProps) {
  const visibleColumns = [
    {
      key: "goat",
      label: "🏆 GOAT",
      visible: selectedCategory === "all" || selectedCategory === "goat",
      values: goat,
    },
    {
      key: "worker",
      label: "🔥 Hardest Worker",
      visible: selectedCategory === "all" || selectedCategory === "worker",
      values: hardestWorker,
    },
    {
      key: "defense",
      label: "🛡️ Defense",
      visible: selectedCategory === "all" || selectedCategory === "defense",
      values: defense,
    },
  ].filter((column) => column.visible);

  return (
    <div className="mb-10 bg-zinc-900 rounded-xl overflow-hidden">
      <div className="bg-zinc-800 px-6 py-4">
        <h2 className="text-2xl font-bold">Game {gameId}</h2>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-700">
            <th className="text-left p-4">Rank</th>
            {visibleColumns.map((column) => (
              <th key={column.key} className="text-left p-4">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {[0, 1, 2, 3, 4].map((index) => (
            <tr key={index} className="border-b border-zinc-800">
              <td className="p-4 font-bold">#{index + 1}</td>
              {visibleColumns.map((column) => (
                <td key={`${column.key}-${index}`} className="p-4">
                  {renderPlayer(column.values[index])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
