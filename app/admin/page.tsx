import Link from "next/link";

export default function AdminDashboard() {
  const cards = [
    {
      title: "Players",
      description:
        "Add, edit, and manage player roster.",
      href: "/admin/players",
      emoji: "⚽",
    },
    {
      title: "Games",
      description:
        "Create games and manage schedules.",
      href: "/admin/games",
      emoji: "📅",
    },
    {
      title: "Stats",
      description:
        "Enter and edit player stats.",
      href: "/admin/stats",
      emoji: "📊",
    },
    
    {
      title: "Public Site",
      description:
        "View the public-facing application.",
      href: "/",
      emoji: "🌎",
    },

    {
      title: "Awards",
      description:
        "Review voting and game awards.",
      href: "/awards",
      emoji: "🏆",
    },

    {
      title: "Player Profiles",
      description:
        "Preview player profile pages.",
      href: "/admin/player-profiles",
      emoji: "👤",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          Admin Dashboard
        </h1>

        <p className="text-zinc-400 mb-10">
          JCU Soccer Fantasy Management
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="
                bg-zinc-900
                border border-zinc-800
                rounded-xl
                p-6
                hover:border-red-500
                hover:bg-zinc-800
                transition
              "
            >
              <div className="text-4xl mb-4">
                {card.emoji}
              </div>

              <h2 className="text-xl font-bold mb-2">
                {card.title}
              </h2>

              <p className="text-zinc-400">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}