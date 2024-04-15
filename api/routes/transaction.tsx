import { TransactionHandler } from "frog";
import { Hex } from "viem";
import { publicClicent } from "../index.js";
import { checkBalance } from "../utils/contract-checks.js";
import { TARGET_ROUTES } from "../constants.js";
import { RouteTransaction } from "../types.js";
import abi from "../utils/degen-abi.json";

export const txFrame: TransactionHandler = async (frameContext) => {
  const { frameData } = frameContext;
  if (frameData?.address) {
    const val = await checkBalance(publicClicent as any, frameData.address);
    console.log("---val---", val);
  }
  return frameContext.contract({
    abi,
    chainId: "eip155:10",
    to: frameContext.address as Hex,
    functionName: "balanceOf",
    args: [frameContext.address as Hex],
  });
};

const txRoute: RouteTransaction = {
  route: TARGET_ROUTES.CHECK_BALANCE,
  handler: txFrame,
};

export default txRoute;
