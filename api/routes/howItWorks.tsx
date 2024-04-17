import { Button, FrameHandler } from "frog";
import { TARGET_ROUTES } from "../constants.js";
import { RoutedFrames } from "../types.js";
import { Box, Column, Columns, Text } from "../utils/ui.js";
import { BETAHeading } from "../components/BETAHeader.js";

const howItWorksFrame: FrameHandler = async (frameContext) => {
  return frameContext.res({
    image: (
      <Box grow color="rumbleNone" backgroundColor="rumbleBgDark">
        <Columns alignHorizontal="center">
          <Column width="6/7" padding={"16"}>
            <Box alignItems="center">
              <BETAHeading />
            </Box>
            <Box paddingTop={"12"} paddingLeft={"24"} paddingRight={"24"}>
              <Text size="24" color="rumblePrimary">
                What is it?
              </Text>
              <Text>
                Rumble Raffle is a completely randomized raffling system where
                players fight to the simulated death. The last player standing
                wins.
              </Text>
            </Box>
            <Box paddingTop={"12"} paddingLeft={"24"} paddingRight={"24"}>
              <Text size="24" color="rumblePrimary">
                How it works?
              </Text>
              <Text>1. Verify an Address on Farcaster</Text>
              <Text>2. Click Join</Text>
              <Text>3. Win, or die trying.</Text>
            </Box>
          </Column>
        </Columns>
      </Box>
    ),
    intents: [
      <Button action={TARGET_ROUTES.JOIN_GAME}>🤜 Join 🤛</Button>,
      <Button action={TARGET_ROUTES.VIEW_GAME_RESULTS}>Results</Button>,
      <Button.Reset>Home</Button.Reset>,
    ],
  });
};

const howItWorks: RoutedFrames = {
  route: TARGET_ROUTES.HOW_IT_WORKS,
  handler: howItWorksFrame,
};

export default howItWorks;
