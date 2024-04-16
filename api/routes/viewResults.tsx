import { Button, FrameHandler } from "frog";
import { getConnectedAddressForUser } from "../utils/pinata-calls.js";
import { TARGET_ROUTES } from "../constants.js";
import { RoutedFrames } from "../types.js";
import { Box, Text, Divider, Spacer } from "../utils/ui.js";
import { BETAHeading } from "../components/BETAHeader.js";

const ViewResultsSuccess = ({
  //   results = [],
  //   participated = undefined,
  results = ["wow", "test", "12", "1asda"],
  participated = { placement: 1, kills: 3 },
}: {
  results?: string[];
  participated?: {
    placement: number;
    kills: number;
  };
}) => (
  <Box grow background="rumbleBgDark" color="rumbleNone">
    <Box alignItems="center">
      <BETAHeading />
      <Text>Next Rumble in 12 min</Text>
    </Box>
    <Box
      alignVertical="center"
      alignItems="center"
      paddingTop={"16"}
      paddingLeft={"40"}
      paddingRight={"40"}
    >
      <Box width="100%" paddingLeft={"40"} paddingRight={"40"}>
        <Box alignItems="center">
          <Text size="24" color="rumblePrimary">
            Results
          </Text>
        </Box>
        <Divider direction="horizontal" color={"rumblePrimary"} />
        <Box>
          {results.length > 0 ? (
            results.map((result, i) => (
              <Text size="16">
                {i + 1}: {result}
              </Text>
            ))
          ) : (
            <Text size="16">
              This is where i'd put my results... If I had any!!!
            </Text>
          )}
        </Box>
        <Spacer size="64" />
      </Box>
    </Box>
    {participated && (
      <Box alignItems="center">
        <Box flexDirection="row">
          <Text>Placement: </Text>
          <Spacer size="4" />
          <Text weight="700" color="rumblePrimary">
            {participated.placement}
          </Text>
          <Spacer size="8" />
          <Text>Kills: </Text>
          <Spacer size="4" />
          <Text weight="700" color="rumblePrimary">
            {participated.kills}
          </Text>
        </Box>
        {participated.placement === 1 && (
          <Text>Winner winner, chicken dinner!</Text>
        )}
      </Box>
    )}
  </Box>
);

const viewResultsFrame: FrameHandler = async (frameContext) => {
  // TODO: Make a fetch to the results API.
  // If we get the users address, we add them to the game.
  if (frameContext.verified && frameContext.frameData) {
    const address = await getConnectedAddressForUser(
      frameContext.frameData.fid
    );
    return frameContext.res({
      image: <ViewResultsSuccess />,
      intents: [<Button action={TARGET_ROUTES.JOIN_GAME}>Refresh</Button>],
    });
  }
  return frameContext.res({
    image: <ViewResultsSuccess />,
    intents: [<Button action={TARGET_ROUTES.JOIN_GAME}>Refresh</Button>],
  });
};

const viewResultsRoute: RoutedFrames = {
  route: TARGET_ROUTES.VIEW_GAME_RESULTS,
  handler: viewResultsFrame,
};

export default viewResultsRoute;
