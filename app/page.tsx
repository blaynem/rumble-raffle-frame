import { getFrameMetadata } from "frog/next";
import type { Metadata } from "next";

// export async function generateMetadata(): Promise<Metadata> {
//   const frameTags = await getFrameMetadata(
//     `${process.env.VERCEL_URL || "http://localhost:3000"}/api`
//   );
//   return {
//     other: frameTags,
//   };
// }

export default function Home(props: any) {
  return (
    <main>
      <h1>Rumble Raffle is Farcaster Frame!</h1>
      <p>
        Best viewed on warpcast here:{" "}
        <a href="https://warpcast.com/drilkmops/0x5b5aa01b">here</a>
      </p>
      <h2>What is it?</h2>
      <p>
        Rumble Raffle is a completely randomized, free to play game where
        players fight to the{" "}
        <span className="dark:text-rumbleSecondary text-rumblePrimary">(</span>
        simulated
        <span className="dark:text-rumbleSecondary text-rumblePrimary">
          )
        </span>{" "}
        death to earn Tokens. The more players you kill, the more tokens you
        earn.
      </p>
      <h2>What sort of events can i expect to happen?</h2>
      <p>PVE</p>
      <ul>
        <li>PLAYER_0 fell head first into a toothpick.</li>
        <li>
          PLAYER_0 was pecked to death in a 'The Birds'-style flock attack.
        </li>
        <li>PLAYER_0 was hit with lag and noclipped into a boulder.</li>
      </ul>
      <p>PVP</p>
      <ul>
        <li>
          PLAYER_0 baked PLAYER_1 some special brownies that exploded upon
          consumption.
        </li>
        <li>PLAYER_0 and PLAYER_1 teamed up and ate PLAYER_2 alive.</li>
        <li>
          PLAYER_0 climbed a tree and dropped a floppy disk onto PLAYER_1.
        </li>
      </ul>
      <p>REVIVE</p>
      <ul>
        <li>
          The population of heaven just decreased, because PLAYER_0 is back!
        </li>
        <li>The devs finally did something! Welcome back PLAYER_0.</li>
        <li>
          Afterlife temporarily closed, sorry for the convenience PLAYER_0.
        </li>
      </ul>
      <p>...and plenty more!</p>
      <h2>Have some events you'd like to suggest?</h2>
      <p>
        If you'd like to suggest some more events, reach out to{" "}
        <a href="https://warpcast.com/drilkmops">drilkmops</a> on warpcast!
      </p>
    </main>
  );
}
