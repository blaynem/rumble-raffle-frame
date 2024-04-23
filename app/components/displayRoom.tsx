import React, { useState, useEffect } from "react";

import { usePreferences } from "../containers/preferences";
import { Environment, Prisma } from "@prisma/client";
import { PlayerType } from "@/RumbleRaffle/types";
import Entrants from "./entrants";
import {
  DisplayActivityLogs,
  DisplayKillCount,
  DisplayWinners,
} from "./activityLog";

export interface ActivityLogClientDisplay {
  activity_id: Prisma.RoomParamsCreateInput["id"];
  activity_loser: PlayerType[];
  activity_order: Prisma.GameRoundLogsCreateInput["activity_order"];
  activity_winner: PlayerType[];
  amountOfPlayers: Prisma.ActivitiesCreateInput["amountOfPlayers"];
  description: Prisma.ActivitiesCreateInput["description"];
  environment: Environment;
  /** Kill counts for the given Activity Log Entry */
  killCounts: (PlayerType & { killCount: number })[];
  participants: PlayerType[];
  /**
   * Note that these only update once every round, not between activities.
   */
  players_remaining: Prisma.GameRoundLogsCreateInput["players_remaining"];
  round_counter: Prisma.GameRoundLogsCreateInput["round_counter"];
}

export interface RoomDataFetchType {
  params: Pick<
    Prisma.RoomParamsGroupByOutputType,
    "id" | "pve_chance" | "revive_chance"
  >;
  players: PlayerType[];
  gameLogs: ActivityLogClientDisplay[];
  winners: PlayerType[];
  /** Total kill count for every participant */
  totalKillCounts: (PlayerType & { killCount: number })[];
}

export type ServerSidePropsType = {
  roomData: RoomDataFetchType;
};

const RumbleRoom = ({ roomData }: { roomData: RoomDataFetchType | null }) => {
  const { preferences } = usePreferences();
  const [darkMode, setDarkMode] = useState(false);
  //   setTimeToGameStart(timeToStart);
  useEffect(() => {
    setDarkMode(preferences?.darkMode);
  }, [preferences?.darkMode]);

  // TODO: Redirect them to home if there is no room shown?
  if (!roomData) {
    return (
      <div className={`${darkMode ? "dark" : "light"}`}>
        <div
          className="flex justify-center dark:bg-rumbleOutline bg-rumbleBgLight"
          style={{ height: "calc(100vh - 58px)" }}
        >
          <div className="w-fit pt-20">
            <p className="text-lg dark:text-rumbleSecondary text-rumblePrimary">
              Oops...
            </p>
            <h2 className="text-xl dark:text-rumbleNone text-rumbleOutline">
              Not a valid room number.
            </h2>
          </div>
        </div>
      </div>
    );
  }

  const user = { id: "1" };

  // If game has already been completed, we show them this view instead.
  // Should refactor this so it all just go
  return (
    <div className={`${darkMode ? "dark" : "light"}`}>
      <div
        className="dark:bg-black bg-rumbleBgLight overflow-auto sm:overflow-hidden"
        style={{ height: "calc(100vh - 58px)" }}
      >
        <h2 className="dark:border-rumbleBgLight border-black text-center p-4 text-xl uppercase dark:bg-rumbleSecondary bg-rumblePrimary dark:text-black text-rumbleNone border-b-2">
          Viewing a past game
        </h2>
        <div className="flex flex-col md:flex-row sm:flex-row">
          {/* Left Side */}
          <div
            className="ml-6 lg:ml-20 md:ml-6 sm:ml-6 pr-6 mr-2 pt-10 overflow-auto scrollbar-thin dark:scrollbar-thumb-rumbleSecondary scrollbar-thumb-rumblePrimary scrollbar-track-rumbleBgDark"
            style={{ height: "calc(100vh - 110px)" }}
          >
            <Entrants entrants={roomData.players} />
            <DisplayKillCount
              totalKillCounts={roomData.totalKillCounts}
              userId={user.id}
            />
          </div>
          {/* Right Side */}
          <div
            className="pr-6 lg:pr-20 md:pr-6 sm:pr-6 py-2 flex-1 overflow-auto scrollbar-thin dark:scrollbar-thumb-rumbleSecondary scrollbar-thumb-rumblePrimary scrollbar-track-rumbleBgDark"
            style={{ height: "calc(100vh - 110px)" }}
          >
            <div className="my-4 h-6 text-center dark:text-rumbleNone text-rumbleOutline" />
            <div className="flex flex-col items-center max-h-full">
              <DisplayActivityLogs
                allActivities={roomData.gameLogs}
                userId={user.id}
              />
              <DisplayWinners winners={roomData.winners} userId={user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RumbleRoom;
