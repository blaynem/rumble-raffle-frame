import { Prisma } from "@prisma/client";
import { prisma } from "./client";

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
  | { result: { skipped: boolean } } //
  | { error: any }
> => {
  try {
    const currentRoom = await getActiveRoomWithParams(room_slug);
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

    await prisma.rooms.upsert(roomsUpsert);
    return { result: { skipped: false } };
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        // A room with the slug already exists, but the game is not completed
        return { result: { skipped: true } };
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
