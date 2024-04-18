import { prisma } from "./client.js";

export const getPlayerCount = async (
  room_params_id: string,
): Promise<{ result: number } | { error: any }> => {
  try {
    const playerCount = await prisma.players.count({
      where: {
        room_params_id: room_params_id,
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
