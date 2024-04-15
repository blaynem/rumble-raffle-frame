import { FrameHandler, TransactionHandler } from "frog";

export type RoutedFrames = {
  route: string;
  handler: FrameHandler;
};

export type RouteTransaction = {
  route: string;
  handler: TransactionHandler;
};
