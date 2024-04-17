import { Button, FrameHandler } from "frog";
import { TARGET_ROUTES } from "../constants.js";
import { RoutedFrames } from "../types.js";
import { Box, Text } from "../utils/ui.js";
import { BETAHeading } from "../components/BETAHeader.js";

const baseRouteFrame: FrameHandler = async (frameContext) => {
  return frameContext.res({
    image: (
      <Box
        grow
        alignItems="center"
        color="rumbleNone"
        backgroundColor="rumbleBgDark"
      >
        <Box grow alignVertical="center">
          <BETAHeading />
          <Text>Will you come out on top?</Text>
        </Box>
        <Box alignVertical="center" flexDirection="row" paddingBottom={"8"}>
          <Text color="rumblePrimary">(</Text>
          <Text>Verified Address required</Text>
          <Text color="rumblePrimary">)</Text>
        </Box>
      </Box>
    ),
    intents: [
      <Button action={TARGET_ROUTES.JOIN_GAME}>🤜 Join the Rumble 🤛</Button>,
      <Button action={TARGET_ROUTES.HOW_IT_WORKS}>How it works</Button>,
    ],
  });
};

const homeRoute: RoutedFrames = {
  route: TARGET_ROUTES.HOME,
  handler: baseRouteFrame,
};

export default homeRoute;
