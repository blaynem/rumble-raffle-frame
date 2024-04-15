import homeRoute from "./home.js";
import joinGameRoute from "./joinGame.js";
import { Frog } from "frog";

export const attachRoutes = (frogApp: Frog) => {
  frogApp.frame(homeRoute.route, homeRoute.handler);
  frogApp.frame(joinGameRoute.route, joinGameRoute.handler);
};
