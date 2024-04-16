import homeRoute from "./home.js";
import joinGameRoute from "./joinGame.js";
import { Frog } from "frog";
import viewResultsFrame from "./viewResults.js";

export const attachRoutes = (frogApp: Frog) => {
  frogApp.frame(homeRoute.route, homeRoute.handler);
  frogApp.frame(joinGameRoute.route, joinGameRoute.handler);
  frogApp.frame(viewResultsFrame.route, viewResultsFrame.handler);
};
