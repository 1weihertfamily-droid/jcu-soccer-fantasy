import Image from "next/image";
import Link from "next/link";

export default function InfoPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold">
            ⚽ Soccer Information Center
          </h1>

          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-3">
            Welcome Parents!
          </h2>

          <p className="text-zinc-300">
            Soccer can move quickly, especially at the youth level.
            This page explains some of the most common rules and situations
            you'll see during Jefferson County United matches.
          </p>
        </div>

        {/* BUILD OUT LINE */}

        <div className="bg-zinc-900 rounded-xl p-6 mb-8">
          <h2 className="text-3xl font-bold mb-4">
            🔵 Field Anatomy
          </h2>

          <Image
            src="/rules/field.png"
            alt="Build Out Line"
            width={1000}
            height={600}
            className="rounded-xl mb-4 w-full"
            priority
          />

          <p className="text-zinc-300">
            The build-out line gives younger players more space to play
            the ball out of the back. Opponents must retreat behind the
            line during goal kicks and goalkeeper possession situations.
          </p>
        </div>

        {/* In Play vs Out of Play */}

        <div className="bg-zinc-900 rounded-xl p-6 mb-8">
          <h2 className="text-3xl font-bold mb-4">
            ⚽  Ball In Play vs Out of Play
          </h2>

          <Image
            src="/rules/inplay.png"
            alt="In Play"
            width={1000}
            height={600}
            className="rounded-xl mb-4 w-full"
          />

          <p className="text-zinc-300">
            A ball is in play as long as it stays within the field boundaries 
            and doesn't touch the ground outside the lines. 
            If the ball completely crosses the goal line or sideline, 
            it's out of play and results in a restart
            (goal kick, corner kick, or throw-in) depending on how it went out.
          </p>
        </div>

        {/* General Positions */}

        <div className="bg-zinc-900 rounded-xl p-6 mb-8">
          <h2 className="text-3xl font-bold mb-4">
            📍 General Positions
          </h2>

          <Image
            src="/rules/positions.png"
            alt="General Positions"
            width={1000}
            height={600}
            className="rounded-xl mb-4 w-full"
          />

          <p className="text-zinc-300">
            General positions refer to the typical roles and locations of players on the field during different phases of play.
            For example, defenders usually stay closer to their own goal, 
            while midfielders often operate in the middle of the field to connect defense and attack,
            while forwards position themselves near the opponent's goal to create scoring opportunities.
          </p>
        </div>
        
        {/* OFFSIDE */}

        <div className="bg-zinc-900 rounded-xl p-6 mb-8">
          <h2 className="text-3xl font-bold mb-4">
            🚩 Offside
          </h2>

          <Image
            src="/rules/offsides.png"
            alt="Offside Rule"
            width={1000}
            height={600}
            className="rounded-xl mb-4 w-full"
          />

          <p className="text-zinc-300">
            A player is offside if they receive a pass while positioned
            closer to the opponent's goal than both the ball and the
            second-to-last defender.
          </p>
        </div>

        

        {/* THROW IN */}

        <div className="bg-zinc-900 rounded-xl p-6 mb-8">
          <h2 className="text-3xl font-bold mb-4">
            🤾 Throw-In
          </h2>

          <Image
            src="/rules/throw-in1.png"
            alt="Throw In"
            width={1000}
            height={600}
            className="rounded-xl mb-4 w-full"
          />

          <p className="text-zinc-300">
            A throw-in occurs when the ball completely crosses the
            sideline/touchline. The opposing team receives possession.
          </p>
        </div>

        {/* HANDBALL */}

        <div className="bg-zinc-900 rounded-xl p-6 mb-8">
          <h2 className="text-3xl font-bold mb-4">
            ✋ Handball
          </h2>

          <Image
            src="/rules/handball1.png"
            alt="Handball"
            width={1000}
            height={600}
            className="rounded-xl mb-4 w-full"
          />

          <p className="text-zinc-300">
            A handball occurs when a player deliberately handles the
            ball or gains an unfair advantage through contact with the
            arm or hand.
          </p>
        </div>

        {/* GOALKEEPER */}

        <div className="bg-zinc-900 rounded-xl p-6 mb-8">
          <h2 className="text-3xl font-bold mb-4">
            🧤🥅 Goalkeeper Rules
          </h2>

          <Image
            src="/rules/goalkeeper.png"
            alt="Goalkeeper Rules"
            width={1000}
            height={600}
            className="rounded-xl mb-4 w-full"
          />

          <p className="text-zinc-300">
            Goalkeepers are the only players allowed to use their hands
            inside their penalty area. They help start play and protect
            the goal.
          </p>
        </div>

      </div>
    </main>
  );
}
