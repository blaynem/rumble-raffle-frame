import { FrameHandler, TransactionHandler } from "frog";
import { Handler } from "hono";

export type HonoRoute = {
  route: string;
  handler: Handler;
};

export type RoutedFrames = {
  route: string;
  handler: FrameHandler;
};

export type RouteTransaction = {
  route: string;
  handler: TransactionHandler;
};
