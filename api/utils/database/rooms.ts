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

/**
 * Method to create or update a room and it's params in the db.
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
export const createOrUpdateRoom = async (
  room_slug: string,
  params: Pick<Prisma.RoomParamsCreateInput, "pve_chance" | "revive_chance">,
  contract_address: string,
  createdBy: string,
): Promise<
  | { result: { skipped: boolean } } //
  | { error: any }
> => {
  try {
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
        Params: {
          create: {
            ...params,
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

    await prisma.rooms.upsert(roomsUpsert);
    return { result: { skipped: false } };
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        // A room with the slug already exists, but the game is not completed
        return { result: { skipped: true } };
      }
    }
    console.error("createOrUpdateRoom error: ", {
      args: { room_slug, params, contract_address, createdBy },
      error: e,
    });
    return { error: e };
  }
};
