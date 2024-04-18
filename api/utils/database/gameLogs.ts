import { Environment } from "@prisma/client";
import { prisma } from "./client.js";
import { getRoomParamsByParamsId } from "./rooms.js";

export const fetchGameLogs = async (room_params_id: string) => {
  return prisma.gameRoundLogs.findMany({
    where: {
      room_params_id,
    },
    include: {
      Activity: true,
    },
  });
};

/**
 * Fetchs all logs of a player in a given room_param_id, sorted by round_counter and activity_order.
 */
export const fetchRoundLogsOfPlayer = async (
  room_params_id: string,
  player_id: string,
) => {
  return prisma.gameRoundLogs.findMany({
    where: {
      room_params_id,
      participants: {
        has: player_id,
      },
    },
    include: {
      Activity: true,
    },
    orderBy: [{
      round_counter: "desc",
    }, {
      activity_order: "desc",
    }],
  });
};

/**
 * What data we want to display to user in Frame
 * - Round they died in
 * - Last 3 activities they participated in
 * - Kill count
 * - Participant names
 * - What placement the player came in in the rumble
 */

export type SpecificPlayerLogsFrame = {
  activityDetails: {
    round_counter: number;
    activity_order: number;
    /**
     * Full parsed description of the activity. Replaces player ids with names.
     */
    description: string;
    type: Environment;
    /**
     * True if the player survived the activity.
     */
    survived: boolean;
  }[];
  /**
   * Placement of the player in the rumble. -1 if not a winner.
   * Places start at 1.
   */
  placement: number;
  totalKillCount: number;
};

/**
 * Fetches all logs of a player in a given room_param_id, and returns a more readable view for the client.
 * @param room_params_id - The room params id
 * @param player_id - The player id
 * @returns Actiivity Details, Placement, Total Kill Count
 */
export const getPlayersGameLogs = async (
  room_params_id: string,
  player_id: string,
): Promise<SpecificPlayerLogsFrame> => {
  const roomData = await getRoomParamsByParamsId(room_params_id);
  if (!roomData) {
    throw new Error("Room params not found");
  }
  const playerLogs = await fetchRoundLogsOfPlayer(room_params_id, player_id);
  /** Particpant map { address: name | null } */
  const _pMap = new Map<string, string | null>();
  for (const log of playerLogs) {
    for (const _participant of log.participants) {
      _pMap.has(_participant) ||
        _pMap.set(_participant, null);
    }
  }

  // Fetch all participants names and then set them in the map
  (await getPlayersByIds(Array.from(_pMap.keys()))).forEach((_p) =>
    _pMap.set(_p.id, _p.name)
  );

  let totalKillCount = 0;
  const activityDetails: SpecificPlayerLogsFrame["activityDetails"] = playerLogs
    .map((log) => {
      const matchPlayerNumber = /(PLAYER_\d+)/; // matches PLAYER_0, PLAYER_12, etc
      const descriptionParts = log.Activity.description.split(
        matchPlayerNumber,
      );

      const replaceNames = descriptionParts.map((part, i) => {
        if (part.match(matchPlayerNumber)) {
          // Gets the player id then finds the name.
          const playerId =
            log.participants[Number(part.replace("PLAYER_", ""))];
          return _pMap.get(playerId);
        }
        return part;
      });

      const activityParticipantIndex = log.participants.findIndex(
        (p) => p === player_id,
      );
      // Player survives if their player index is not in the log.loser array
      const survived = !log.Activity.activityLoser.includes(
        activityParticipantIndex,
      );
      const killCount = log.Activity.killCounts[activityParticipantIndex];
      totalKillCount += +killCount;
      return {
        survived,
        round_counter: log.round_counter,
        activity_order: log.activity_order,
        description: replaceNames.join(""),
        type: log.Activity.environment,
      };
    });

  // fetch all participants names.
  let placement = roomData.winners.findIndex((winner) => winner === player_id);
  return {
    activityDetails,
    // If the player is not a winner / runner up, they will have placement of -1
    // We then add 1, as placements are 1 indexed.
    // TODO: When we change the placements inside RumbleRaffle, we should also alter this.
    placement: placement < 0 ? -1 : placement + 1,
    totalKillCount,
  };
};

/**
 * Returns in the correct order.
 */
export const getPlayersByIds = async (ids: string[]) => {
  const returnedData = await prisma.users.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
  return ids.map((id) =>
    returnedData.find((d) => d.id === id) || { id, name: null }
  );
};
