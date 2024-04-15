import { Button, FrameHandler } from "frog";
import { getConnectedAddressForUser } from "../utils/pinata-calls.js";
import { TARGET_ROUTES } from "../constants.js";
import { RoutedFrames } from "../types.js";
import { Box, Heading, VStack, Text, THEME } from "../utils/ui.js";

const JoinedGame = () => (
  <Box
    grow
    alignVertical="center"
    alignItems="center"
    padding="12"
    background={{ custom: THEME.colors.rumbleBgDark }}
    color={{ custom: THEME.colors.rumblePrimary }}
  >
    <VStack>
      <Heading>Rumble Raffle</Heading>
      <Text>Next Rumble starts in: 12 Minutes</Text>
    </VStack>
  </Box>
);

export const joinGameFrame: FrameHandler = async (frameContext) => {
  if (frameContext.verified && frameContext.frameData) {
    const address = await getConnectedAddressForUser(
      frameContext.frameData.fid
    );
  }
  return frameContext.res({
    image: <JoinedGame />,
    intents: [
      <Button action={TARGET_ROUTES.JOIN_GAME}>Refresh</Button>,
      // <Button.Transaction target={TARGET_ROUTES.CHECK_BALANCE}>
      //   Transaction
      // </Button.Transaction>,
    ],
  });
};

const joinGameRoute: RoutedFrames = {
  route: TARGET_ROUTES.JOIN_GAME,
  handler: joinGameFrame,
};

export default joinGameRoute;
