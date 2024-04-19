import { Frog } from "frog";
import startGameRoute from "./startGame";

export const attachWebHooks = (app: Frog) => {
  app.hono.post(startGameRoute.route, startGameRoute.handler);
};
