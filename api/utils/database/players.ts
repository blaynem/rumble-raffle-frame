import { prisma } from "./client.js";
import { getActiveRoomWithParams } from "./rooms.js";

export const getPlayerCount = async (
  room_slug: string,
): Promise<{ result: number } | { error: any }> => {
  try {
    const room = await getActiveRoomWithParams(room_slug);
    if (!room) throw new Error("No active room found");

    const playerCount = await prisma.players.count({
      where: {
        room_params_id: room.params_id,
      },
    });

    return { result: playerCount };
  } catch (error) {
    console.error(error);
    return { error: "Could not get player count" };
  }
};

/**
 * Get all players for a given room.
 */
export const getAllPlayersOfRoom = async (
  slug: string,
) =>
  await prisma.players.findMany({
    where: {
      slug: slug,
    },
    include: {
      User: true,
    },
  });
