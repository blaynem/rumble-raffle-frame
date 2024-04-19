import { Frog } from "frog";
import startGameRoute from "./startGame.js";

export const attachWebHooks = (app: Frog) => {
  app.hono.post(startGameRoute.route, startGameRoute.handler);
};
