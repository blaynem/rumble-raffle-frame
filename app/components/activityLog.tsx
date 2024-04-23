import React, { Fragment } from "react";
import LocalHospitalOutlined from "@mui/icons-material/LocalHospitalOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { Swords } from "tabler-icons-react";
import "react-popper-tooltip/dist/styles.css";

import { ClickToCopyPopper } from "./Popper";
import HikingOutlined from "@mui/icons-material/HikingOutlined";
import { PlayerType } from "@/RumbleRaffle/types";
import { ActivityLogClientDisplay } from "../gameLogs/displayRoom";

const iconClass = "h-5 w-5 dark:stroke-rumbleNone block";
const iconClassMui = "h-5 w-5 dark:fill-rumbleNone fill-rumbleOutline block";

const replaceActivityDescPlaceholders = (
  activity: ActivityLogClientDisplay
): (string | JSX.Element)[] => {
  const matchPlayerNumber = /(PLAYER_\d+)/; // matches PLAYER_0, PLAYER_12, etc
  const parts = activity.description.split(matchPlayerNumber);

  const replaceNames = parts.map((part, i) => {
    if (part.match(matchPlayerNumber)) {
      const index = Number(part.replace("PLAYER_", ""));
      // Gets the name of the player.
      const player = activity.participants[index];
      // We return null in this activity when it's a discord user since we didn't store their id.
      if (player === null) {
        return (
          <ClickToCopyPopper
            key={i}
            boldText
            text={"Discord User"}
            popperText={"Discord id not found."}
          />
        );
      }
      const webPlayer = player as PlayerType;
      return (
        <ClickToCopyPopper
          key={i}
          boldText
          text={webPlayer.name}
          popperText={webPlayer.id}
        />
      );
    }
    return part;
  });
  return replaceNames;
};

const ActivityBreak = () => (
  <li className="ml-4 h-4 border-l-2 dark:border-l-rumbleNone/40 border-l-black"></li>
);

/**
 * Split this off so we can reuse it for the winners.
 * @returns
 */
const ActivityListItem = ({
  description,
  highlight,
  icon,
}: {
  icon: any;
  description: (string | JSX.Element)[];
  highlight: boolean;
}) => (
  <li className="ml-2 flex text-lg relative">
    <span className="self-center pr-4">{icon}</span>
    <span
      className={`p-2 font-light dark:text-rumbleNone ${
        highlight ? "dark:bg-rumbleNone/20 bg-rumbleTertiary/40" : ""
      }`}
    >
      {description}
    </span>
  </li>
);

const getActivityIcon = (activity: ActivityLogClientDisplay) => {
  const { environment } = activity;
  if (environment === "REVIVE") {
    return <LocalHospitalOutlined className={iconClassMui} />;
  }
  if (environment === "PVE") {
    return <HikingOutlined className={iconClassMui} />;
  }
  return <Swords className={iconClass} />;
};

const DisplayActivity = ({
  activity,
  containsUser,
}: {
  activity: ActivityLogClientDisplay;
  containsUser: boolean;
}) => {
  return (
    <ActivityListItem
      icon={getActivityIcon(activity)}
      highlight={containsUser}
      description={replaceActivityDescPlaceholders(activity)}
    />
  );
};

const DisplayRound = ({
  players_remaining,
  roundCounter,
  logs,
  userId,
}: {
  players_remaining: number;
  roundCounter: number;
  logs: ActivityLogClientDisplay[];
  userId: string;
}) => {
  /**
   * Returns true if the play is present in the array
   */
  const containsUser = (participants: PlayerType[]) =>
    participants.findIndex((p) => p?.id === userId) > -1;
  return (
    <div key={roundCounter} className="w-full">
      <h3 className="ml-4 border-l-2 dark:border-l-rumbleNone/40 border-l-black text-lg dark:text-rumbleSecondary text-rumblePrimary uppercase font-medium py-2 px-9">
        Round {roundCounter + 1}
      </h3>
      <ul>
        {logs.map((activity, index) => (
          <Fragment key={`${activity.activity_id}-${index}`}>
            <DisplayActivity
              activity={activity}
              containsUser={containsUser(activity.participants)}
            />
            <ActivityBreak />
          </Fragment>
        ))}
        <li className="ml-4 border-l-2 dark:border-l-rumbleNone/40 border-l-black pt-2 pb-8 px-9 lowercase text-base dark:text-rumbleNone/60 text-rumbleOutline/60">
          {players_remaining} {players_remaining > 1 ? "players" : "player"}{" "}
          left
        </li>
      </ul>
    </div>
  );
};

export const DisplayWinners = ({
  winners,
  userId,
}: {
  winners: PlayerType[];
  userId: string;
}) => {
  const placementMessage = [
    "Congratulations! 1st place goes to",
    "2nd place",
    "3rd place",
  ];
  return (
    <div className="w-full pb-8">
      <h3 className="ml-4 border-l-2 dark:border-l-rumbleNone/40 border-l-black text-lg dark:text-rumbleSecondary text-rumblePrimary uppercase font-medium py-2 px-9">
        Winner
      </h3>
      <ul>
        {winners.slice(0, 3).map((winner, i) => (
          <Fragment key={winner.id}>
            {i > 0 && <ActivityBreak />}
            <ActivityListItem
              icon={<EmojiEventsOutlinedIcon className={iconClassMui} />}
              description={[
                placementMessage[i],
                " ",
                <ClickToCopyPopper
                  key={winner.id}
                  boldText
                  text={winner.name}
                  popperText={winner.id}
                />,
                ".",
              ]}
              highlight={winner.id === userId}
            />
          </Fragment>
        ))}
      </ul>
    </div>
  );
};

export const DisplayActivityLogs = ({
  allActivities,
  userId,
}: {
  allActivities: ActivityLogClientDisplay[];
  userId: string;
}) => {
  const roundMap = new Map<number, ActivityLogClientDisplay[]>();
  //  Group the activities by round
  for (const activity of allActivities) {
    if (roundMap.has(activity.round_counter)) {
      roundMap.get(activity.round_counter)?.push(activity);
    } else {
      roundMap.set(activity.round_counter, [activity]);
    }
  }

  return Array.from(roundMap.entries()).map(([round, logs]) => (
    <DisplayRound
      key={round}
      logs={logs}
      userId={userId}
      roundCounter={round}
      // The remaining players doesn't change between individual logs in a round, only at the end of a round.
      players_remaining={logs[0].players_remaining}
    />
  ));
};

const DisplayEntrantKills = ({
  count,
  name,
  popperText,
  highlighted,
}: {
  name: string;
  popperText: string;
  count: number;
  highlighted: boolean;
}) => (
  <li
    className={`mr-6 mb-2 last:mb-0 dark:text-rumbleNone text-rumbleOutline text-base font-normal ${
      highlighted ? "dark:bg-rumbleNone/20 bg-rumbleTertiary/40" : ""
    }`}
  >
    <div className="flex justify-between">
      <ClickToCopyPopper text={name} popperText={popperText} truncate />
      <div>{count}</div>
    </div>
  </li>
);

export const DisplayKillCount = ({
  totalKillCounts,
  userId,
}: {
  totalKillCounts: (PlayerType & { killCount: number })[];
  userId: string;
}) => {
  return (
    <div className="mb-8 w-80 py-6 pl-6 border-2 dark:border-rumbleNone border-rumbleOutline">
      <div className="dark:text-rumbleSecondary text-rumblePrimary uppercase text-lg font-medium leading-7 mb-2">
        Kill Count
      </div>
      <ul className="max-h-80 overflow-auto scrollbar-thin scrollbar-thin dark:scrollbar-thumb-rumbleSecondary scrollbar-thumb-rumblePrimary scrollbar-track-rumbleBgDark">
        {totalKillCounts.length < 1 ? (
          <li className="mb-0 dark:text-rumbleNone text-rumbleOutline text-base font-normal">
            No kills yet.
          </li>
        ) : (
          totalKillCounts.map((player) => {
            return (
              <DisplayEntrantKills
                key={player?.id}
                count={player.killCount}
                name={player.name}
                popperText={player.id}
                highlighted={player.id === userId}
              />
            );
          })
        )}
      </ul>
    </div>
  );
};
