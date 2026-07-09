import type { DraggableProvided } from "@hello-pangea/dnd";

export type Game = {
  id: number;
  name: string;
  game_date: string | null;
  active: boolean;
  voting_open: boolean;
  display_order: number | null;
  season_id: number | null;
};

type AdminGameRowProps = {
  game: Game;
  provided: DraggableProvided;
  onUpdateGame: (id: number, updates: Partial<Game>) => void;
  onResetVoting: (gameId: number) => void;
  onClearStats: (gameId: number) => void;
};

export default function AdminGameRow({
  game,
  provided,
  onUpdateGame,
  onResetVoting,
  onClearStats,
}: AdminGameRowProps) {
  return (
    <tr
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="border-b border-zinc-800"
      style={provided.draggableProps.style}
    >
      <td
        className="p-4 cursor-grab text-zinc-400"
        {...(provided.dragHandleProps ?? {})}
      >
        ☰
      </td>

      <td className="p-4">
        <input
          value={game.name}
          onChange={(e) =>
            onUpdateGame(game.id, { name: e.target.value })
          }
          className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
        />
      </td>

      <td className="p-4">
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={game.game_date ?? ""}
            onChange={(e) =>
              onUpdateGame(game.id, {
                game_date: e.target.value === "" ? null : e.target.value,
              })
            }
            className="p-2 rounded bg-zinc-800 border border-zinc-700"
          />

          <button
            onClick={() => onUpdateGame(game.id, { game_date: null })}
            className="bg-zinc-700 hover:bg-red-600 px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      </td>

      <td className="text-center">
        <input
          type="checkbox"
          checked={game.active}
          onChange={(e) =>
            onUpdateGame(game.id, { active: e.target.checked })
          }
        />
      </td>

      <td className="text-center">
        <input
          type="checkbox"
          checked={game.voting_open}
          onChange={(e) =>
            onUpdateGame(game.id, { voting_open: e.target.checked })
          }
        />
      </td>

      <td className="text-center p-2">
        <button
          onClick={() => onResetVoting(game.id)}
          className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm font-semibold w-full"
        >
          Reset Voting
        </button>
      </td>

      <td className="text-center p-2">
        <button
          onClick={() => onClearStats(game.id)}
          className="bg-orange-600 hover:bg-orange-700 px-3 py-2 rounded text-sm font-semibold w-full"
        >
          Clear Stats
        </button>
      </td>
    </tr>
  );
}
