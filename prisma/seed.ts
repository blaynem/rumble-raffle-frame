import { Prisma, PrismaClient } from "@prisma/client";
import { defaultActivities } from "../RumbleRaffle/activity_examples/default_activities.js";
import { addUser } from "../api/utils/database/users.js";
import {
  BLAYNE_EVM_ADDRESS,
  BLAYNE_FID,
  DEGEN_CONTRACT,
} from "../api/constants.js";
import { createRoom } from "../api/utils/database/rooms.js";

const prisma = new PrismaClient();
async function main() {
  // Create the contract
  try {
    await prisma.contracts.create({
      data: {
        contract_address: DEGEN_CONTRACT.toLowerCase(), // Ensure lowercase
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

  // Create me as a user
  const blayne_user = await addUser({
    id: BLAYNE_EVM_ADDRESS,
    name: "drilkmops",
    farcaster_id: BLAYNE_FID,
  });
  console.log("Created user", blayne_user);

  // Create a room
  const room = await createRoom(
    "default",
    {
      pve_chance: 30,
      revive_chance: 5,
    },
    DEGEN_CONTRACT,
    BLAYNE_EVM_ADDRESS,
  );
  console.log("Created room", room);
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
