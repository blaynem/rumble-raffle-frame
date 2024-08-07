/** @jsxImportSource frog/jsx */

import { Button, FrameHandler } from "frog";
import { getUserDataByFID } from "../utils/pinata-calls";
import { TARGET_ROUTES } from "../constants";
import { RoutedFrames } from "../types";
import { Box, VStack, Text, Heading } from "../utils/ui";
import { BETAHeading } from "../components/BETAHeader";
import { minifyAddress, timeUntilNextRumble } from "../utils/utils";
import { getActiveRoomWithParams } from "../utils/database/rooms";
import { addPlayerToRoom, addUser } from "../utils/database/users";
import { getPlayerCount } from "../utils/database/players";

const JoinedGameSuccess = ({
  address,
  entrantCount,
}: {
  address: string;
  entrantCount: number;
}) => (
  <Box
    grow
    alignVertical="center"
    alignItems="center"
    background="rumbleBgDark"
    color="rumbleNone"
  >
    <VStack>
      <BETAHeading />
      <Text>
        {timeUntilNextRumble()} {entrantCount && `Entrants: ${entrantCount}`}
      </Text>
      <Box flexDirection="row" gap={"2"}>
        <Text>Joined with</Text>
        <Text color="rumblePrimary">{minifyAddress(address)}</Text>
      </Box>
    </VStack>
  </Box>
);

const JoinGameError = () => (
  <Box
    grow
    alignVertical="center"
    alignItems="center"
    background="rumbleBgDark"
    color="rumbleNone"
  >
    <VStack>
      <Heading color="rumblePrimary">Oops!</Heading>
      <Text>Looks like you need to verify your Address on Farcaster!</Text>
      <Box paddingTop={"8"}>
        <Text>If this is a mistake, try to join again.</Text>
      </Box>
      <Box paddingTop={"8"} flexDirection="row" gap="4">
        <Text>If the error persists please reach out to</Text>
        <Text color="rumblePrimary">@drilkmops</Text>
      </Box>
    </VStack>
  </Box>
);

/**
 * Adding a user to the game.
 * 1. Get the user's address from the FID.
 * 2. Add the user to the database.
 * 3. Add the user to the room.
 *
 * @returns The user's evm address
 */
export const addUserToGameFlow = async ({
  farcaster_id,
  room_slug,
}: {
  room_slug: string;
  farcaster_id: number;
}): Promise<
  { result: { address: string; room_params_id: string } } | { error: any }
> => {
  try {
    const { address, username } = await getUserDataByFID(farcaster_id);
    if (!address || !username) throw new Error("User not found");
    // Add the user to the database
    const userData = await addUser({
      id: address,
      farcaster_id: farcaster_id.toString(),
      name: username,
    });
    if ("error" in userData) throw userData.error;

    // Get the active room
    const room = await getActiveRoomWithParams(room_slug);
    if (!room) throw new Error("No active room found");

    const addedToRoom = await addPlayerToRoom({
      slug: room.slug,
      room_params_id: room.params_id,
      player_id: address,
    });
    if ("error" in addedToRoom) throw addedToRoom.error;

    return { result: { address, room_params_id: room.params_id } };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

const joinGameFrame: FrameHandler = async (frameContext) => {
  try {
    // If we don't have a verified user, we show the error message.
    if (!frameContext.verified || !frameContext.frameData) {
      throw new Error("User not verified");
    }

    const data = await addUserToGameFlow({
      room_slug: "default",
      farcaster_id: frameContext.frameData.fid,
    });
    if ("error" in data) throw data.error;

    const playercount = await getPlayerCount(data.result.room_params_id);
    const entrantCount = ("result" in playercount && playercount.result) || 0;

    return frameContext.res({
      image: (
        <JoinedGameSuccess
          address={data.result.address}
          entrantCount={entrantCount}
        />
      ),
      intents: [
        <Button action={TARGET_ROUTES.JOIN_GAME}>Refresh</Button>,
        <Button action={TARGET_ROUTES.VIEW_GAME_RESULTS}>View Results</Button>,
      ],
    });
  } catch (error) {
    // If not, we display "must have connected wallet" message.
    return frameContext.res({
      image: <JoinGameError />,
      intents: [
        <Button action={TARGET_ROUTES.JOIN_GAME}>Join Game</Button>,
        <Button action={TARGET_ROUTES.VIEW_GAME_RESULTS}>View Results</Button>,
        <Button.Link href="https://warpcast.com/drilkmops">
          @drilkmops
        </Button.Link>,
      ],
    });
  }
};

const joinGameRoute: RoutedFrames = {
  route: TARGET_ROUTES.JOIN_GAME,
  handler: joinGameFrame,
};

export default joinGameRoute;
