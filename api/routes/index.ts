import { Frog } from "frog";
import homeRoute from "./home.js";
import joinGameRoute from "./joinGame.js";
import viewGameResultsFrame from "./viewGameResults.js";
import howItWorks from "./howItWorks.js";

export const attachRoutes = (frogApp: Frog) => {
  frogApp.frame(homeRoute.route, homeRoute.handler);
  frogApp.frame(joinGameRoute.route, joinGameRoute.handler);
  frogApp.frame(viewGameResultsFrame.route, viewGameResultsFrame.handler);
  frogApp.frame(howItWorks.route, howItWorks.handler);
};
