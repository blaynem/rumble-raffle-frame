import { Button, FrameHandler } from "frog";
import { getConnectedAddressForUser } from "../utils/pinata-calls.js";
import { TARGET_ROUTES } from "../constants.js";
import { RoutedFrames } from "../types.js";
import { Box, VStack, Text, Heading } from "../utils/ui.js";
import { BETAHeading } from "../components/BETAHeader.js";
import { minifyAddress } from "../utils/utils.js";

const JoinedGameSuccess = ({ address }: { address: string }) => (
  <Box
    grow
    alignVertical="center"
    alignItems="center"
    background="rumbleBgDark"
    color="rumbleNone"
  >
    <VStack>
      <BETAHeading />
      <Text>Next Rumble starts in: 12 Minutes</Text>
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
    </VStack>
  </Box>
);

const joinGameFrame: FrameHandler = async (frameContext) => {
  // If we get the users address, we add them to the game.
  if (frameContext.verified && frameContext.frameData) {
    const address = await getConnectedAddressForUser(
      frameContext.frameData.fid
    );
    return frameContext.res({
      image: <JoinedGameSuccess address={address} />,
      intents: [
        <Button action={TARGET_ROUTES.JOIN_GAME}>Refresh</Button>,
        <Button action={TARGET_ROUTES.VIEW_GAME_RESULTS}>View Results</Button>,
      ],
    });
  }
  // If not, we display "must have connected wallet" message.
  return frameContext.res({
    image: <JoinGameError />,
    intents: [
      <Button action={TARGET_ROUTES.JOIN_GAME}>Join Game</Button>,
      <Button action={TARGET_ROUTES.VIEW_GAME_RESULTS}>View Results</Button>,
    ],
  });
};

const joinGameRoute: RoutedFrames = {
  route: TARGET_ROUTES.JOIN_GAME,
  handler: joinGameFrame,
};

export default joinGameRoute;
