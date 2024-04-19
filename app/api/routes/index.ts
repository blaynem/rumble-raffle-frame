import { Frog } from "frog";
import homeRoute from "./home";
import joinGameRoute from "./joinGame";
import viewGameResultsFrame from "./viewGameResults";
import howItWorks from "./howItWorks";

export const attachRoutes = (frogApp: Frog) => {
  frogApp.frame(homeRoute.route, homeRoute.handler);
  frogApp.frame(joinGameRoute.route, joinGameRoute.handler);
  frogApp.frame(viewGameResultsFrame.route, viewGameResultsFrame.handler);
  frogApp.frame(howItWorks.route, howItWorks.handler);
};
