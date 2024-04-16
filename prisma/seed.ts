import { Prisma, PrismaClient } from "@prisma/client";
import { defaultActivities } from "../RumbleRaffle/activity_examples/default_activities.js";

const prisma = new PrismaClient();
async function main() {
  // Create the contract
  try {
    await prisma.contracts.create({
      data: {
        contract_address: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
        chain_id: 8453,
        network_name: "Base Mainnet",
        name: "Degen Token",
        symbol: "DEGEN",
        decimals: 18,
      },
    });
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        console.log("Skipping seed of db as it already exists");
        return;
      }
    }
    throw e;
  }

  // Add all the activities
  await prisma.activities.createMany({
    data: [
      ...defaultActivities.PVE,
      ...defaultActivities.PVP,
      ...defaultActivities.REVIVE,
    ],
    skipDuplicates: true,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
