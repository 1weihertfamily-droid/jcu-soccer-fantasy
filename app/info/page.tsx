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

        {/* Team Code of Conduct */}

        <div className="bg-zinc-900 rounded-xl p-6 mb-10 border border-zinc-800">
          <h2 className="text-3xl font-bold mb-4 text-red-500">
            ❤️ United Soccer Team Code of Conduct
          </h2>

          <div className="space-y-3 text-lg">
            <div>
              <span className="font-bold text-blue-400">
                1. Team First
              </span>
              {" "}
              – We play as one team and help each other.
            </div>

            <div>
              <span className="font-bold text-blue-400">
                2. Have Fun
              </span>
              {" "}
              – Smile, learn, and enjoy the game.
            </div>

            <div>
              <span className="font-bold text-blue-400">
                3. Show Good Sportsmanship
              </span>
              {" "}
              – Be kind and respectful to teammates,
              coaches, referees, and opponents.
            </div>

            <div>
              <span className="font-bold text-blue-400">
                4. Try Your Best
              </span>
              {" "}
              – Give your best effort every practice
              and every game.
            </div>

            <div>
              <span className="font-bold text-blue-400">
                5. Never Give Up
              </span>
              {" "}
              – Keep working hard, even when things
              are difficult.
            </div>

            <div>
              <span className="font-bold text-blue-400">
                6. Be Positive
              </span>
              {" "}
              – Encourage others and use positive
              words.
            </div>

            <div>
              <span className="font-bold text-blue-400">
                7. Listen and Learn
              </span>
              {" "}
              – Pay attention and be ready to improve.
            </div>
          </div>

          <div className="mt-8 bg-zinc-800 rounded-lg p-5 border-l-4 border-red-500">
            <h3 className="text-xl font-bold mb-2">
              ⚽ Our Team Promise
            </h3>

            <p className="text-lg italic text-zinc-200">
              "We are United. We play together, work hard,
              have fun, and show respect every day."
            </p>
          </div>
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
            A ball is in play (A, B & C) as long as it stays within the field boundaries 
            and doesn't touch the ground outside the lines. 
            If the ball completely crosses the goal line or sideline (D), 
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
            🚷 Offside
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
            src="/rules/throw-in.png"
            alt="Throw In"
            width={1000}
            height={600}
            unoptimized
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
            src="/rules/handball.png"
            alt="Handball"
            width={1000}
            height={600}
            unoptimized
            className="rounded-xl mb-4 w-full"
          />

          <p className="text-zinc-300">
            A handball occurs when a player deliberately handles the
            ball or gains an unfair advantage through contact with the
            arm or hand.
          </p>
        </div>

        {/* CORNER KICK */}

        <div className="bg-zinc-900 rounded-xl p-6 mb-8">
          <h2 className="text-3xl font-bold mb-4">
            🚩 Corner Kick
          </h2>

          <Image
            src="/rules/corner-kick.png"
            alt="Corner Kick"
            width={1000}
            height={600}
            className="rounded-xl mb-4 w-full"
          />

          <p className="text-zinc-300">
            A corner kick is awarded when the defending team touches the
            ball last before it crosses the goal line.
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

      <div className="mt-16">
  <h2 className="text-4xl font-bold mb-8">
    📚 Soccer Terminology Guide
  </h2>

  <div className="space-y-6">

    <div className="bg-zinc-900 rounded-xl p-6">
      <h3 className="text-2xl font-bold mb-4">
        ⚽ Basics
      </h3>

      <ul className="space-y-2 text-zinc-300">
        <li><strong>Ball control:</strong> Keeping the ball close while moving.</li>
        <li><strong>Dribble:</strong> Move the ball with your feet while running.</li>
        <li><strong>Pass:</strong> Kick the ball to a teammate.</li>
        <li><strong>Shot:</strong> Kick the ball toward the goal to score.</li>
        <li><strong>First touch:</strong> Your very first control when the ball comes to you.</li>
        <li><strong>Trap:</strong> Stop or slow the ball with your foot, thigh, or chest.</li>
        <li><strong>Header:</strong> Hit the ball with your forehead.</li>
      </ul>
    </div>

    <div className="bg-zinc-900 rounded-xl p-6">
      <h3 className="text-2xl font-bold mb-4">
        📍 Field & Lines
      </h3>

      <ul className="space-y-2 text-zinc-300">
        <li><strong>Pitch / Field:</strong> Where the game is played.</li>
        <li><strong>Sideline / Touchline:</strong> The long boundary lines on the sides.</li>
        <li><strong>Goal line:</strong> The line the ball must fully cross to score.</li>
        <li><strong>Penalty Area (The Box):</strong> Large box in front of each goal.</li>
        <li><strong>Goal Area (6):</strong> Small box inside the penalty area.</li>
        <li><strong>Center Circle:</strong> Circle at midfield for kickoffs.</li>
        <li><strong>Corner Arc:</strong> Quarter-circle where corner kicks are taken.</li>
      </ul>
    </div>

    <div className="bg-zinc-900 rounded-xl p-6">
      <h3 className="text-2xl font-bold mb-4">
        👥 Positions
      </h3>

      <ul className="space-y-2 text-zinc-300">
        <li><strong>Goalkeeper (Keeper):</strong> Protects the goal and can use hands inside the penalty area.</li>
        <li><strong>Defender:</strong> Stops opponents and protects the goal.</li>
        <li><strong>Midfielder:</strong> Helps defend and attack.</li>
        <li><strong>Forward / Striker:</strong> Tries to score goals.</li>
        <li><strong>Wing / Winger:</strong> Wide player who attacks and supports from the sides.</li>
      </ul>
    </div>

    <div className="bg-zinc-900 rounded-xl p-6">
      <h3 className="text-2xl font-bold mb-4">
        🔄 Game Restarts
      </h3>

      <ul className="space-y-2 text-zinc-300">
        <li><strong>Kickoff:</strong> Start or restart from the center circle.</li>
        <li><strong>Throw-In:</strong> Restart when the ball leaves the sideline.</li>
        <li><strong>Goal Kick:</strong> Restart for defenders after attackers send the ball over the goal line.</li>
        <li><strong>Corner Kick:</strong> Restart for attackers after defenders send the ball over the goal line.</li>
        <li><strong>Free Kick:</strong> Kick awarded after a foul.</li>
        <li><strong>Penalty Kick (PK):</strong> Direct shot from the penalty spot after certain fouls.</li>
        <li><strong>Drop Ball:</strong> Referee drops the ball to restart play.</li>
      </ul>
    </div>

    <div className="bg-zinc-900 rounded-xl p-6">
      <h3 className="text-2xl font-bold mb-4">
        📖 Rules Kids Should Know
      </h3>

      <ul className="space-y-2 text-zinc-300">
        <li><strong>Offside:</strong> An attacking player cannot gain an unfair advantage by being beyond the defenders when the ball is played.</li>
        <li><strong>Foul:</strong> Illegal contact or action.</li>
        <li><strong>Handball:</strong> Deliberately handling the ball with the arm or hand.</li>
        <li><strong>Advantage:</strong> Referee allows play to continue after a foul if it benefits the fouled team.</li>
        <li><strong>Yellow Card:</strong> Warning.</li>
        <li><strong>Red Card:</strong> Sent off for the remainder of the match.</li>
      </ul>
    </div>

    <div className="bg-zinc-900 rounded-xl p-6">
      <h3 className="text-2xl font-bold mb-4">
        🤝 Team Play Words
      </h3>

      <ul className="grid md:grid-cols-2 gap-y-2 text-zinc-300">
        <li><strong>Space:</strong> Open area without defenders.</li>
        <li><strong>Support:</strong> Help a teammate with the ball.</li>
        <li><strong>Switch:</strong> Move the ball across the field.</li>
        <li><strong>Width:</strong> Use the entire field.</li>
        <li><strong>Depth:</strong> Players positioned behind and ahead.</li>
        <li><strong>Overlap:</strong> Teammate runs around another player.</li>
        <li><strong>Give-and-Go:</strong> Pass and immediately run forward.</li>
        <li><strong>Cross:</strong> Pass from a wide area toward goal.</li>
        <li><strong>Through Ball:</strong> Pass behind defenders.</li>
        <li><strong>Press:</strong> Apply pressure to win the ball back.</li>
        <li><strong>Mark Up:</strong> Stay close to an opponent.</li>
        <li><strong>Clearance:</strong> Remove danger near goal.</li>
        <li><strong>Counter:</strong> Fast attack after winning possession.</li>
      </ul>
    </div>

    <div className="bg-zinc-900 rounded-xl p-6">
      <h3 className="text-2xl font-bold mb-4">
        🧤 Goalkeeper Terms
      </h3>

      <ul className="space-y-2 text-zinc-300">
        <li><strong>Save:</strong> Stop a shot from entering the goal.</li>
        <li><strong>Distribution:</strong> Rolling, throwing, or kicking the ball to start play.</li>
      </ul>
    </div>

    <div className="bg-zinc-900 rounded-xl p-6">
      <h3 className="text-2xl font-bold mb-4">
        📣 Common Sideline Calls
      </h3>

      <ul className="grid md:grid-cols-2 gap-y-2 text-zinc-300">
        <li><strong>Man On:</strong> Defender is close.</li>
        <li><strong>Time:</strong> You have space.</li>
        <li><strong>Turn:</strong> Face toward goal.</li>
        <li><strong>Hold / Delay:</strong> Slow the attack.</li>
        <li><strong>Switch:</strong> Change sides.</li>
        <li><strong>Step:</strong> Defenders move up.</li>
        <li><strong>Drop:</strong> Move back or pass back.</li>
        <li><strong>Away:</strong> Clear the ball.</li>
        <li><strong>Shoot:</strong> Take a shot.</li>
      </ul>
    </div>

    <div className="bg-zinc-900 rounded-xl p-6">
      <h3 className="text-2xl font-bold mb-4">
        😎 Fun Soccer Slang
      </h3>

      <ul className="space-y-2 text-zinc-300">
        <li><strong>Nutmeg:</strong> Play the ball through an opponent's legs.</li>
        <li><strong>1v1:</strong> One attacker versus one defender.</li>
        <li><strong>50/50 Ball:</strong> Loose ball either team can win.</li>
      </ul>
    </div>

  </div>
</div>
    </main>
  );
}
