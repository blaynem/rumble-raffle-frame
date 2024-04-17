import { RumbleRaffle } from "../../../RumbleRaffle/index.js";
import { prisma } from "../database/client.js";
import {
  getActiveRoomWithParams,
  getAllActivities,
} from "../database/rooms.js";
import { getAllPlayersOfRoom } from "../database/users.js";
import {
  parseActivityLogForClient,
  parseActivityLogForDbPut,
} from "./parsingLogs.js";
import { selectPayoutFromGameData } from "./parsingPayouts.js";

export const startGame = async (room_slug: string) => {
  // Get the room data + params
  const roomData = await getActiveRoomWithParams(room_slug);
  if (!roomData) throw new Error("No active room found");
  if (roomData.Params.game_completed) throw new Error("Game already completed");

  // Get all activities
  const activities = await getAllActivities();

  // Get all the players
  const players = await getAllPlayersOfRoom(roomData.slug);
  const rumble = new RumbleRaffle({
    activities,
    params: {
      chanceOfPve: roomData.Params.pve_chance,
      chanceOfRevive: roomData.Params.revive_chance,
    },
    initialPlayers: players.map((p) => ({ id: p.User.id, name: p.User.name })),
  });

  // Play out the game.
  const gameResults = rumble.startAutoPlayGame();

  // Parse the game results for the client
  const clientParsedResults = parseActivityLogForClient(gameResults);

  // Parse the returned game data
  const dbParsedResults = parseActivityLogForDbPut(
    clientParsedResults,
    roomData.Params.id,
  );

  // Save it to db,
  await prisma.gameRoundLogs.createMany({
    data: dbParsedResults,
  });

  // Calculate payout info
  //   const payoutInfo = selectPayoutFromGameData(roomData, gameResults)
  const payoutInfo = selectPayoutFromGameData({
    gameKills: gameResults.gameKills,
    gameWinner: gameResults.gameWinner,
    contract_address: roomData.Params.Contract.contract_address,
    room_params_id: roomData.Params.id,
  });
  // Submit all payouts to db
  await prisma.payouts.createMany({
    data: payoutInfo,
  });

  // Update the room with the winners
  await prisma.rooms.update({
    where: {
      id: roomData.id,
    },
    data: {
      Params: {
        update: {
          game_completed: true,
          game_started: true,
          winners: clientParsedResults.winners.map((w) => w.id),
        },
      },
    },
  });
};
