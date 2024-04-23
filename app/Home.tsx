"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { usePreferences } from "./containers/preferences";
import RumbleRoom, { RoomDataFetchType } from "./components/displayRoom";
import { GetAllGameLogsForSlug } from "./api/raffle/route";
import { BASE_WEB_URL } from "./api/constants";

const fetchCurrentRaffleData = async (
  slug: string
): Promise<GetAllGameLogsForSlug> => {
  const raffleFetchData = await fetch(
    `${BASE_WEB_URL}/api/raffle?slug=${slug}`
  );
  const data = (await raffleFetchData.json()) as GetAllGameLogsForSlug;

  return data;
};

const pageTitle = `Rumble Raffle`;
export default function PageIndex() {
  const { preferences } = usePreferences();

  const [darkMode, setDarkMode] = useState(false);
  const [gameState, setGameState] = useState<RoomDataFetchType | null>(null);

  useEffect(() => {
    setDarkMode(preferences?.darkMode);
  }, [preferences?.darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCurrentRaffleData("default");
      if ("error" in data) {
        return setGameState(null);
      }
      setGameState(data.latestGame);
    };

    fetchData();
  }, []);

  return (
    <div className={`${darkMode ? "dark" : "light"}`}>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="Rumble Raffle. Fight your friends, earn RUMBLE tokens. Join the discord for latest news!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="p-8 dark:bg-black bg-rumbleBgLight w-full overflow-auto scrollbar-thin dark:scrollbar-thumb-rumbleSecondary scrollbar-thumb-rumblePrimary scrollbar-track-rumbleBgDark"
        style={{ height: "calc(100vh - 58px)" }}
      >
        <h1 className="uppercase font-medium mt-6 mb-12 text-2xl text-center dark:text-rumbleSecondary text-rumblePrimary">
          Welcome to Rumble Raffle!
        </h1>
        <section className="md:px-40 sm:px-8">
          <h2 className="uppercase mb-2 text-xl dark:text-rumbleSecondary text-rumblePrimary">
            What the heck is this?
          </h2>
          <p className="mb-8 dark:text-rumbleNone text-rumbleOutline">
            Rumble Raffle is a completely randomized game where players fight to
            the{" "}
            <span className="dark:text-rumbleSecondary text-rumblePrimary">
              (
            </span>
            simulated
            <span className="dark:text-rumbleSecondary text-rumblePrimary">
              )
            </span>{" "}
            death to earn Rewards. The more players you kill, the greater the
            Rewards you earn.
          </p>
          <p className="mb-8 dark:text-rumbleNone text-rumbleOutline">
            Join by visiting the Rumble Raffle{" "}
            <a
              className=" dark:text-rumbleSecondary text-rumblePrimary"
              href="https://warpcast.com/~/channel/rumbleraffle"
            >
              Warpcast channel
            </a>{" "}
            and click "Join" in the Farcaster Frame. Make sure your address is
            verified through Warpcast.
          </p>

          <h2 className="uppercase mb-2 text-xl dark:text-rumbleSecondary text-rumblePrimary">
            What the heck are those?
          </h2>
          <p className="mb-8 dark:text-rumbleNone text-rumbleOutline">
            {
              "RMBLB Tokens will be exchanged for a more customized experience! While we iron out all the details, we'll let you accumulate them in the background."
            }
          </p>
          <p className="mb-8 dark:text-rumbleNone text-rumbleOutline">
            While in{" "}
            <span className="dark:text-rumbleSecondary text-rumblePrimary">
              ((
            </span>
            BETA
            <span className="dark:text-rumbleSecondary text-rumblePrimary">
              ))
            </span>{" "}
            we won't be sending out those tokens quite yet. In the meantime, we
            are giving out $DEGEN as a reward for participating. See the
            Farcaster Frame to play!
          </p>

          <h2 className="uppercase mb-2 text-xl dark:text-rumbleSecondary text-rumblePrimary">
            Where the heck can I learn more?
          </h2>
          <p className="dark:text-rumbleNone text-rumbleOutline">
            The best place to find more information would be on the warpcaster
            channel itself.
          </p>
          <ol className="mb-8 pl-8 list-disc dark:text-rumbleNone text-rumbleOutline">
            <li>
              <a
                rel="noreferrer noopener"
                target="_blank"
                href={"https://warpcast.com/~/channel/rumbleraffle"}
                className="uppercase dark:text-rumbleSecondary text-rumblePrimary"
              >
                Warpcaster
              </a>
            </li>
          </ol>
          <h2 className="uppercase mb-2 text-xl dark:text-rumbleSecondary text-rumblePrimary">
            What sort of events can i expect to happen?
          </h2>
          <p className="dark:text-rumbleNone text-rumbleOutline">PVE</p>
          <ul className="pl-8 list-disc  dark:text-rumbleNone text-rumbleOutline">
            <li>PLAYER_0 fell head first into a toothpick.</li>
            <li>
              PLAYER_0 was pecked to death in a 'The Birds'-style flock attack.
            </li>
            <li>PLAYER_0 was hit with lag and noclipped into a boulder.</li>
          </ul>
          <p className="dark:text-rumbleNone text-rumbleOutline">PVP</p>
          <ul className="pl-8 list-disc  dark:text-rumbleNone text-rumbleOutline">
            <li>
              PLAYER_0 baked PLAYER_1 some special brownies that exploded upon
              consumption.
            </li>
            <li>PLAYER_0 and PLAYER_1 teamed up and ate PLAYER_2 alive.</li>
            <li>
              PLAYER_0 climbed a tree and dropped a floppy disk onto PLAYER_1.
            </li>
          </ul>
          <p className="dark:text-rumbleNone text-rumbleOutline">REVIVE</p>
          <ul className="pl-8 list-disc  dark:text-rumbleNone text-rumbleOutline">
            <li>
              The population of heaven just decreased, because PLAYER_0 is back!
            </li>
            <li>The devs finally did something! Welcome back PLAYER_0.</li>
            <li>
              Afterlife temporarily closed, sorry for the convenience PLAYER_0.
            </li>
          </ul>
          <p className="mb-8 dark:text-rumbleNone text-rumbleOutline">
            ...and plenty more!
          </p>
          <h2 className="uppercase mb-2 text-xl dark:text-rumbleSecondary text-rumblePrimary">
            Have some events you'd like to suggest?
          </h2>
          <p className="dark:text-rumbleNone text-rumbleOutline">
            If you'd like to suggest some more events, you can make a suggestion
            on the warpcast{" "}
            <a
              className=" dark:text-rumbleSecondary text-rumblePrimary"
              href="https://warpcast.com/~/channel/rumbleraffle"
            >
              Rumble Raffle
            </a>{" "}
            channel!
          </p>
        </section>
        <section>{gameState && <RumbleRoom roomData={gameState} />}</section>
      </div>
    </div>
  );
}
