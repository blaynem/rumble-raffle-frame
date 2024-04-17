import { Prisma } from "@prisma/client";
import { prisma } from "./client.js";

/**
 * Create or update a user in the database.
 */
export const addUser = async (
  user: Prisma.UsersCreateInput,
): Promise<{ result: { id: string; name: string } } | { error: any }> => {
  try {
    const data = await prisma.users.upsert({
      where: {
        id: user.id.toLowerCase(), // Lowercase the address
      },
      update: {
        name: user.name,
      },
      create: {
        id: user.id.toLowerCase(),
        name: user.name,
        farcaster_id: user.farcaster_id,
      },
    });
    return { result: data };
  } catch (e: any) {
    console.error(e);
    return { error: e };
  }
};

type AddPlayerToRoom = {
  slug: string;
  room_params_id: string;
  player_id: string;
};
/**
 * Add a player to a room.
 */
export const addPlayerToRoom = async ({
  slug,
  room_params_id,
  player_id,
}: AddPlayerToRoom): Promise<{ result: AddPlayerToRoom } | { error: any }> => {
  try {
    await prisma.players.create({
      data: {
        slug,
        room_params_id,
        player: player_id.toLowerCase(), // Ensure lowercase evm address
      },
    });
    return { result: { slug, room_params_id, player_id } };
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        // Player already exists in room, so it's a success!
        return { result: { slug, room_params_id, player_id } };
      }
    }
    console.error("addPlayerToRoom error: ", {
      args: { slug, room_params_id, player_id },
      error: e,
    });
    return { error: e };
  }
};

/**
 * Get all players for a given room.
 */
export const getAllPlayersOfRoom = async (
  roomId: string,
) =>
  await prisma.players.findMany({
    where: {
      slug: roomId,
    },
    include: {
      User: true,
    },
  });
