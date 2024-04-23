import { Prisma, PrismaClient } from "@prisma/client";
import { defaultActivities } from "../RumbleRaffle/activity_examples/default_activities";
import {
  BLAYNE_EVM_ADDRESS,
  BLAYNE_FID,
  DEGEN_CONTRACT,
} from "../app/api/constants";
import { createOrUpdateRoom } from "../app/api/utils/database/rooms";
import { runRumbleGame } from "@/app/api/utils/rumble/gameState";

const prisma = new PrismaClient();
const SLUG_NAME = "default";
const users = [
  {
    id: BLAYNE_EVM_ADDRESS,
    name: "drilkmops",
    farcaster_id: BLAYNE_FID,
  },
  {
    id: "0xd0dc1223cbe7af98469d05edee2dd789acb076d2",
    name: "torchthemall",
    farcaster_id: "234457",
  },
  {
    id: "0x96a77560146501eaeb5e6d5b7d8dd1ed23defa23",
    name: "pugson",
    farcaster_id: "557",
  },
  {
    id: "0x547a2e8d97dc99be21e509fa93c4fa5dd76b8ed0",
    name: "lght.eth",
    farcaster_id: "13121",
  },
  {
    id: "0x6e59ccc5c5cd6a800939fc5c68d3bdd082e21f53",
    name: "neged",
    farcaster_id: "398355",
  },
  {
    id: "0xf1e7dbedd9e06447e2f99b1310c09287b734addc",
    name: "Jacek",
    farcaster_id: "15983",
  },
  {
    id: "0x000cbf0bec88214aab15bc1fa40d3c30b3ca97a9",
    name: "dusan",
    farcaster_id: "11124",
  },
  {
    id: "0xb5f1fed7e87af7544c565ecdc3db40faf43fdc78",
    name: "leospeaks.eth",
    farcaster_id: "4271",
  },
  {
    id: "0xe744d23107c9c98df5311ff8c1c8637ec3ecf9f3",
    name: "zafgod",
    farcaster_id: "270684",
  },
  {
    id: "0xcb43078c32423f5348cab5885911c3b5fae217f9",
    name: "ripe",
    farcaster_id: "11124",
  },
].map((_u) => ({
  ..._u,
  id: _u.id.toLowerCase(), // These need to always be lowercase
}));

async function seedUsers() {
  console.log("Starting seeding users");

  await prisma.users.createMany({
    data: users.map((user) => ({
      id: user.id,
      name: user.name,
      farcaster_id: user.farcaster_id,
    })),
    skipDuplicates: true,
  });

  console.log("Finished seeding users");
}

async function seedPlayersToRoom(params_id: string) {
  console.log("Starting adding users to game");

  await prisma.players.createMany({
    data: users.map((user) => ({
      slug: SLUG_NAME,
      room_params_id: params_id,
      player: user.id,
    })),
    skipDuplicates: true,
  });

  console.log("Finished adding users to game");
}

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

  await seedUsers().catch((e) => {
    console.error("---error seeding users", e);
  });

  // Create a room + room params
  const room = await createOrUpdateRoom({
    room_slug: SLUG_NAME,
    params: {
      pve_chance: 30,
      revive_chance: 5,
    },
    contract_address: DEGEN_CONTRACT,
    createdBy: BLAYNE_EVM_ADDRESS,
  });
  if ("error" in room) {
    console.error("Error creating room", room.error);
    return;
  }

  console.log("----Seeding players to room 1");
  // Seed all the players to the room
  await seedPlayersToRoom(room.result.roomData.params_id).catch((e) => {
    console.error("---error adding users to game 1", e);
  });

  console.log("----Running game");
  // Run a game.
  const newRoomData = await runRumbleGame(SLUG_NAME).catch((e) => {
    return { error: e };
  });
  if ("error" in newRoomData) {
    console.error("Error running game", newRoomData.error);
    return;
  }

  console.log("----Seeding players to room 2");
  // Then potentially seed all the players to the new param id once more?
  await seedPlayersToRoom(newRoomData.newGamesData.params_id).catch((e) => {
    console.error("---error adding users to game 2", e);
  });

  for (let i = 0; i < 10; i++) {
    // Repeat another time
    console.log("----Running game -- ", i);
    // Run a game.
    const newRoomDatax = await runRumbleGame(SLUG_NAME).catch((e) => {
      return { error: e };
    });
    if ("error" in newRoomDatax) {
      console.error("Error running game", newRoomDatax.error);
      return;
    }

    console.log("----Seeding players to room", i);
    // Then potentially seed all the players to the new param id once more?
    await seedPlayersToRoom(newRoomDatax.newGamesData.params_id).catch((e) => {
      console.error("---error adding users to game", i, e);
    });
  }
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
