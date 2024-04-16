import { Activities, Players, Prisma, Users } from "@prisma/client";
import { prisma } from "./client.js";
import { ActivityTypes } from "../../../RumbleRaffle/types/activity.js";

/**
 * Create or update a user in the database.
 */
export const addUser = async (
  user: Prisma.UsersCreateInput,
): Promise<Users> => {
  return await prisma.users.upsert({
    where: {
      id: user.id,
    },
    update: user,
    create: user,
  });
};

/**
 * Add a player to a room.
 */
export const addPlayerToRoom = async (
  player: Prisma.PlayersCreateInput,
): Promise<Players> =>
  await prisma.players.create({
    data: player,
  });

/**
 * Get all players for a given room.
 */
export const getAllPlayersOfRoom = async (
  roomId: string,
): Promise<Players[]> =>
  await prisma.players.findMany({
    where: {
      slug: roomId,
    },
  });

const convertKillCountToNum = (data: Activities): ActivityTypes => ({
  ...data,
  killCounts: data.killCounts.map((k) => k.toNumber()),
});

/**
 * Get all activities from the database.
 */
export const getAllActivities = async (): Promise<{
  pveData: ActivityTypes[];
  pvpData: ActivityTypes[];
  reviveData: ActivityTypes[];
}> => {
  const pveData: ActivityTypes[] = (await prisma.activities.findMany({
    where: {
      environment: "PVE",
    },
  })).map(convertKillCountToNum);

  const pvpData: ActivityTypes[] = (await prisma.activities.findMany({
    where: {
      environment: "PVP",
    },
  })).map(convertKillCountToNum);

  const reviveData: ActivityTypes[] = (await prisma.activities.findMany({
    where: {
      environment: "REVIVE",
    },
  })).map(convertKillCountToNum);

  return {
    pveData,
    pvpData,
    reviveData,
  };
};

/**
 * Create a room in the database.
 * @param slug - The room slug.
 * @param params - The room parameters.
 * @param contract_address - The contract address tied to the room.
 * @returns
 */
export const createRoom = async (
  slug: string,
  params: Prisma.RoomParamsCreateInput,
  contract_address: string,
) => {
  const createdBy = "PLACEHOLDER_USER_ID";

  const roomsUpsert: Prisma.RoomsUpsertArgs = {
    where: {
      slug: slug,
    },
    update: {
      Params: {
        create: {
          pve_chance: params.pve_chance,
          revive_chance: params.revive_chance,
          ...(createdBy && {
            Creator: {
              connect: {
                id: createdBy,
              },
            },
          }),
          Contract: {
            connect: {
              contract_address: contract_address.toLowerCase(),
            },
          },
        },
      },
    },
    create: {
      slug: slug,
      Params: {
        create: {
          ...params,
          ...(createdBy && {
            Creator: {
              connect: {
                id: createdBy,
              },
            },
          }),
          Contract: {
            connect: {
              contract_address: contract_address.toLowerCase(),
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

  return await prisma.rooms.upsert(roomsUpsert);
};
