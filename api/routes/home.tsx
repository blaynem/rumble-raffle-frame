import { Button, FrameHandler } from "frog";
import { TARGET_ROUTES } from "../constants.js";
import { RoutedFrames } from "../types.js";
import { Box, Heading, VStack, Text, THEME } from "../utils/ui.js";

export const baseRouteFrame: FrameHandler = async (frameContext) => {
  return frameContext.res({
    image: (
      <Box
        grow
        alignVertical="center"
        alignItems="center"
        padding="12"
        color={{ custom: THEME.colors.rumblePrimary }}
        backgroundColor={{ custom: THEME.colors.rumbleBgDark }}
      >
        <VStack>
          <Heading>Rumble Raffle</Heading>
          <Text>Will you come out on top?</Text>
        </VStack>
      </Box>
    ),
    intents: [
      <Button action={TARGET_ROUTES.JOIN_GAME}>🤜 Join the Rumble 🤛</Button>,
      // <Button.Transaction target={TARGET_ROUTES.CHECK_BALANCE}>
      //   Transaction
      // </Button.Transaction>,
    ],
  });
};

const homeRoute: RoutedFrames = {
  route: TARGET_ROUTES.HOME,
  handler: baseRouteFrame,
};

export default homeRoute;
