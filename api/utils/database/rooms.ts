import { Activities, Prisma } from "@prisma/client";
import { ActivityTypes } from "../../../RumbleRaffle/types/activity.js";
import { prisma } from "./client.js";

export const getActiveRoom = async (room_slug: string) =>
  prisma.rooms.findFirst({
    where: {
      slug: room_slug,
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

export const createRoom = async (
  room_slug: string,
  params: Pick<Prisma.RoomParamsCreateInput, "pve_chance" | "revive_chance">,
  contract_address: string,
  /**
   * Must be an EVM compatible address.
   */
  createdBy: string,
) => {
  const roomsUpsert: Prisma.RoomsUpsertArgs = {
    where: {
      slug: room_slug,
    },
    update: {
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
    create: {
      slug: room_slug,
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
