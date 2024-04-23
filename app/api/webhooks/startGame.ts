import { Context, Handler } from "hono";
import { WEBHOOK_ROUTES } from "../constants";
import { HonoRoute } from "../types";
import { runRumbleGame } from "../utils/rumble/gameState";

const handleStartGame: Handler = async (c: Context) => {
  const body = await c.req.json();
  if (body.password !== "SUPER_SECRET_PASSWORD") {
    return c.json({ error: "Not allowed." });
  }
  const startedGameData = await runRumbleGame("default");
  if ("error" in startedGameData) {
    console.error(startedGameData.error);
    return c.json({ error: startedGameData.error });
  }
  return c.json({ startedGameData });
};

const startGameRoute: HonoRoute = {
  route: WEBHOOK_ROUTES.START_GAME,
  handler: handleStartGame,
};

export default startGameRoute;
