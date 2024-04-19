import { Context, Handler } from "hono";
import {
  BLAYNE_EVM_ADDRESS,
  DEGEN_CONTRACT,
  WEBHOOK_ROUTES,
} from "../constants";
import { HonoRoute } from "../types";
import { createOrUpdateRoom } from "../utils/database/rooms";
import { startGame } from "../utils/rumble/gameState";

const handleStartGame: Handler = async (c: Context) => {
  const body = await c.req.json();
  if (body.password !== "SUPER_SECRET_PASSWORD") {
    return c.json({ error: "Not allowed." });
  }
  const startedGameData = await startGame("default");
  if ("error" in startedGameData) {
    console.error(startedGameData.error);
    return c.json({ error: startedGameData.error });
  }

  const roomdData = await createOrUpdateRoom({
    room_slug: "default",
    contract_address: DEGEN_CONTRACT,
    params: {
      pve_chance: 30,
      revive_chance: 3,
    },
    createdBy: BLAYNE_EVM_ADDRESS,
  });
  if ("error" in roomdData) {
    console.error(roomdData.error);
    return c.json({ error: roomdData.error });
  }
  return c.json({ startedGameData, roomdData });
};

const startGameRoute: HonoRoute = {
  route: WEBHOOK_ROUTES.START_GAME,
  handler: handleStartGame,
};

export default startGameRoute;
