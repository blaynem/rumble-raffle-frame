import { Prisma } from "@prisma/client";
import { prisma } from "./client";
import {
  ActivityLogClientDisplay,
  RoomDataFetchType,
} from "@/app/components/displayRoom";
import { PlayerType } from "@/RumbleRaffle/types";

// Used for a single round within a game
export type RoundsType =
  & Pick<
    Prisma.GameRoundLogsGroupByOutputType,
    | "activity_id"
    | "round_counter"
    | "activity_order"
    | "participants"
    | "players_remaining"
  >
  & {
    Activity: Pick<
      Prisma.ActivitiesGroupByOutputType,
      | "activityLoser"
      | "activityWinner"
      | "killCounts"
      | "environment"
      | "amountOfPlayers"
      | "description"
    >;
  };

export const getActiveRoomWithParams = async (room_slug: string) =>
  prisma.rooms.findFirst({
    where: {
      slug: room_slug,
    },
    include: {
      Params: {
        include: {
          Contract: true,
        },
      },
    },
  });

export const getRoomParamsByParamsId = async (params_id: string) =>
  prisma.roomParams.findFirst({
    where: {
      id: params_id,
    },
  });

export type CreateOrUpdateRoomData = {
  id: string;
  slug: string;
  params_id: string;
  last_game_params_id: string | null;
};

/**
 * Given a room slug, will either create or update a room with the provided params.
 *
 * Will create a new room if:
 * * A room with given slug is not found
 *
 * Will update a room if:
 * * A room with given slug is found AND the game is completed
 *
 * Will error if:
 * * A room with given slug is found AND the game is not completed
 *
 * The error will be caught and handled by this method.
 *
 * @param room_slug The room slug
 * @param params The room params
 * @param contract_address The contract address
 * @param createdBy The creator of the room - EVM Address lowercased
 * @returns a result object if successful or an error object if not. The result object will
 * contain a `skipped` boolean if the room was not updated because the game is not completed.
 */
export const createOrUpdateRoom = async ({
  room_slug,
  params,
  contract_address,
  createdBy,
}: {
  room_slug: string;
  params: Pick<Prisma.RoomParamsCreateInput, "pve_chance" | "revive_chance">;
  contract_address: string;
  createdBy: string;
}): Promise<
  | {
    result: {
      skipped: boolean;
      roomData: CreateOrUpdateRoomData;
    };
  } //
  | { error: any }
> => {
  /** If the game has not been started yet, then we will error. So storing this data to pass in the catch. */
  let knownRoomDataObj: CreateOrUpdateRoomData = {
    id: "",
    slug: "",
    params_id: "",
    last_game_params_id: null,
  };
  try {
    const currentRoom = await getActiveRoomWithParams(room_slug);
    if (currentRoom) {
      knownRoomDataObj = {
        id: currentRoom.id,
        slug: currentRoom.slug,
        params_id: currentRoom.Params.id,
        last_game_params_id: currentRoom.last_game_params_id,
      };
    }
    const _current_params_id = currentRoom?.Params.id;
    // Lowercase the addresses
    const _createdBy = createdBy.toLowerCase();
    const _contract_address = contract_address.toLowerCase();

    const roomsUpsert: Prisma.RoomsUpsertArgs = {
      where: {
        slug: room_slug,
        Params: {
          game_completed: true, // Only update if the game is completed
        },
      },
      update: {
        // if _current_params_id is undefined, we need to remove it from the prisma call. otherwise it errors.
        ...(_current_params_id && {
          PrevParams: {
            connect: {
              id: _current_params_id,
            },
          },
        }),
        Params: {
          create: {
            ...params,
            room_slug,
            Creator: {
              connect: {
                id: _createdBy,
              },
            },
            Contract: {
              connect: {
                contract_address: _contract_address,
              },
            },
          },
        },
      },
      create: {
        slug: room_slug,
        Params: {
          create: {
            ...params,
            room_slug,
            Creator: {
              connect: {
                id: _createdBy,
              },
            },
            Contract: {
              connect: {
                contract_address: _contract_address,
              },
            },
          },
        },
      },
      include: {
        Params: {
          include: {
            Contract: true,
          },
        },
      },
    };

    const upsertData = await prisma.rooms.upsert(roomsUpsert);
    return {
      result: {
        skipped: false,
        roomData: {
          id: upsertData.id,
          slug: upsertData.slug,
          params_id: upsertData.params_id,
          last_game_params_id: upsertData.last_game_params_id,
        },
      },
    };
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        // A room with the slug already exists, but the game is not completed
        return { result: { skipped: true, roomData: knownRoomDataObj } };
      }
      if (e.code === "P2025") {
        // Contract not found
        console.error("CreateOrUpdateRoom error: ", {
          args: { room_slug, params, contract_address, createdBy },
          meta: e.meta,
        });
        return { error: "Could not find Contract or User to link to" };
      }
    }
    console.error("CreateOrUpdateRoom unhandled error: ", {
      args: { room_slug, params, contract_address, createdBy },
      error: e,
    });
    return { error: e };
  }
};

/**
 * Returns all game param IDs from a given slug, order from the most recently completed game.
 * Excludes games that are not completed.
 *
 * @param slug
 */
export const getAllParamIdsFromSlug = async (
  slug: string,
  return_order: "asc" | "desc" = "desc",
): Promise<{ data: string[] } | { error: any }> => {
  try {
    const data = await prisma.roomParams.findMany({
      where: { room_slug: slug, game_completed: true },
      select: {
        id: true,
        completed_at: true,
      },
      orderBy: {
        completed_at: return_order,
      },
    });

    return {
      data: data.map((param) => param.id),
    };
  } catch (error) {
    console.error("Server: Fetch by slug", error);
    return {
      error: "There was an error fetching the data.",
    };
  }
};

/**
 * Given a params_id, fetches the game log data.
 */
export const getGameLogByParamsId = async (
  params_id: string,
): Promise<
  {
    data: RoomDataFetchType;
  } | { error: any }
> => {
  try {
    const result = await prisma.roomParams.findUnique({
      where: {
        id: params_id,
      },
      select: {
        pve_chance: true,
        revive_chance: true,
        id: true,
        winners: true,
        Players: {
          select: {
            User: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        GameLogs: {
          include: {
            Activity: true,
          },
        },
      },
    });
    if (result === null) {
      throw new Error(`Could not find data for params_id: ${params_id}`);
    }
    // Create a players map as we'll need to loop through this a few times.
    const playerMap = new Map<string, PlayerType>();
    result.Players.forEach((_p) => playerMap.set(_p.User.id, _p.User));

    const winners: PlayerType[] = result.winners.map((_w) =>
      playerMap.get(_w) as PlayerType
    );

    // Sort the game logs by round_counter and activity_order
    const orderedGameLogs = result.GameLogs.sort(
      (a, b) => {
        if (a.round_counter !== b.round_counter) {
          return a.round_counter - b.round_counter;
        }
        return a.activity_order - b.activity_order;
      },
    );

    // Add a map of total kills by player
    const totalKillsByPlayer = new Map<string, number>();

    const getParticipantOrder = (_participants: string[]): PlayerType[] =>
      _participants.map((id) => playerMap.get(id)) as PlayerType[];

    const parsedGameLogs: ActivityLogClientDisplay[] = orderedGameLogs.map(
      (log) => {
        // Map the participant ids to the player object
        const participantOrder = getParticipantOrder(log.participants);
        const killCounts = log.Activity.killCounts.map((count, index) => ({
          id: participantOrder[index].id,
          name: participantOrder[index].name,
          killCount: +count,
        }));

        // Add the kill counts to the total kill count
        for (const _k of killCounts) {
          if (totalKillsByPlayer.has(_k.id)) {
            totalKillsByPlayer.set(
              _k.id,
              totalKillsByPlayer.get(_k.id)! + _k.killCount,
            );
          } else {
            totalKillsByPlayer.set(_k.id, _k.killCount);
          }
        }

        const parsedLog: ActivityLogClientDisplay = {
          activity_id: log.activity_id,
          activity_loser: log.Activity.activityLoser.map((index) =>
            participantOrder[index] as PlayerType
          ),
          activity_order: log.activity_order,
          activity_winner: log.Activity.activityWinner.map((index) =>
            participantOrder[index] as PlayerType
          ),
          amountOfPlayers: log.Activity.amountOfPlayers,
          description: log.Activity.description,
          environment: log.Activity.environment,
          killCounts: killCounts,
          participants: participantOrder,
          players_remaining: log.players_remaining,
          round_counter: log.round_counter,
        };

        return parsedLog;
      },
    );

    const data: RoomDataFetchType = {
      players: result.Players.map((player) => player.User),
      params: {
        id: result.id,
        pve_chance: result.pve_chance,
        revive_chance: result.revive_chance,
      },
      gameLogs: parsedGameLogs,
      winners: winners,
      totalKillCounts: Array.from(totalKillsByPlayer).map((
        [id, killCount],
      ) => ({
        id,
        name: playerMap.get(id)!.name,
        killCount,
      })).sort((a, b) => b.killCount - a.killCount),
    };
    return { data };
  } catch (error) {
    console.error("Server: Fetch by params_id", error);
    return { error: "There was an error fetching the game log data." };
  }
};
