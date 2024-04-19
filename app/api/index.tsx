import { Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/next";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { attachRoutes } from "./routes/index";
import { pinata } from "frog/hubs";
import { vars } from "./utils/ui";
import { attachWebHooks } from "./webhooks/index";

export const publicClicent = createPublicClient({
  chain: base,
  transport: http(),
});

// Needs the name `app` otherwise frog gets ornery.
export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  hub: pinata(),
  // Inject the ui
  ui: { vars },
  // If silent we will not throw an error if verification fails. We will still return `verified` as false though
  verify: "silent",
});

// Attach the routes
attachRoutes(app);
attachWebHooks(app);

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
