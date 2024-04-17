import { Button, FrameHandler, FrameIntent } from "frog";
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
      <Box paddingTop={"8"} flexDirection="row" gap="4">
        <Text>If the error persists please reach out to</Text>
        <Text color="rumblePrimary">@drilkmops</Text>
      </Box>
    </VStack>
  </Box>
);

// Intents that should be used in both success and error states.
const intents: FrameIntent[] = [
  <Button action={TARGET_ROUTES.JOIN_GAME}>Refresh</Button>,
  <Button action={TARGET_ROUTES.VIEW_GAME_RESULTS}>View Results</Button>,
];

const joinGameFrame: FrameHandler = async (frameContext) => {
  // If we get the users address, we add them to the game.
  if (frameContext.verified && frameContext.frameData) {
    const address = await getConnectedAddressForUser(
      frameContext.frameData.fid
    );
    return frameContext.res({
      image: <JoinedGameSuccess address={address} />,
      intents: intents,
    });
  }
  // If not, we display "must have connected wallet" message.
  return frameContext.res({
    image: <JoinGameError />,
    intents: [
      ...intents,
      <Button.Link href="https://warpcast.com/drilkmops">
        @drilkmops
      </Button.Link>,
    ],
  });
};

const joinGameRoute: RoutedFrames = {
  route: TARGET_ROUTES.JOIN_GAME,
  handler: joinGameFrame,
};

export default joinGameRoute;
