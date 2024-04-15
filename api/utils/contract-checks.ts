import abi from "./degen-abi.json";
import { PublicClient } from "viem";

export const DEGEN_CONTRACT = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed";
const CONTRACT = DEGEN_CONTRACT;

export async function checkBalance(
  client: PublicClient,
  address: any
): Promise<number | { error: unknown }> {
  try {
    const balance = await client.readContract({
      address: CONTRACT,
      abi: abi,
      functionName: "balanceOf",
      args: [address],
    });
    const readableBalance = Number(balance);
    return readableBalance;
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function remainingSupply(client: PublicClient) {
  try {
    const balance = await client.readContract({
      address: CONTRACT,
      abi: abi,
      functionName: "totalSupply",
    });
    const readableBalance = Number(balance);
    return readableBalance;
  } catch (error) {
    console.log(error);
    return error;
  }
}
