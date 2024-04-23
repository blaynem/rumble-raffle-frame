export const TARGET_ROUTES = {
  HOME: "/",
  JOIN_GAME: "/joinGame",
  CHECK_BALANCE: "/checkBalance",
  VIEW_GAME_RESULTS: "/viewGameResults",
  HOW_IT_WORKS: "/howItWorks",
};

export const WEBHOOK_ROUTES = {
  START_GAME: "/webhooks/startGame",
};

// EVM addresses
export const DEGEN_CONTRACT = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"
  .toLowerCase();
export const BLAYNE_EVM_ADDRESS = "0x6b5750f9E2C60AE6C6AcacB6558760BedAd2E761"
  .toLowerCase();
export const BLAYNE_FID = "456235";

export const BASE_WEB_URL = process.env.BASE_WEB_URL || "http://localhost:3000";
