import abi from "./degen-abi.json";
import { Address, PublicClient } from "viem";

export async function checkBalance(
  client: PublicClient,
  contract_address: Address,
  evm_address: Address,
): Promise<number | { error: unknown }> {
  try {
    const balance = await client.readContract({
      address: contract_address,
      abi: abi,
      functionName: "balanceOf",
      args: [evm_address],
    });
    const readableBalance = Number(balance);
    return readableBalance;
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function remainingSupply(
  client: PublicClient,
  contract_address: Address,
) {
  try {
    const balance = await client.readContract({
      address: contract_address,
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
