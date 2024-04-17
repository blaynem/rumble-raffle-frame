import { Button, FrameHandler, FrameIntent } from "frog";
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

const intents: FrameIntent[] = [
  <Button action={TARGET_ROUTES.VIEW_GAME_RESULTS}>Refresh</Button>,
  <Button action={TARGET_ROUTES.JOIN_GAME}>Join Game</Button>,
  <Button.Reset>Home</Button.Reset>,
  // TODO: Actually get a dump of the most current logs
  // <Button.Link href="/seefullLogs">Logs</Button.Link>,
];

const viewGameResultsFrame: FrameHandler = async (frameContext) => {
  // TODO: Make a fetch to the results API.
  // If we get the users address, we add them to the game.
  if (frameContext.verified && frameContext.frameData) {
    const address = await getConnectedAddressForUser(
      frameContext.frameData.fid
    );
    return frameContext.res({
      image: <ViewResultsSuccess />,
      intents: intents,
    });
  }
  return frameContext.res({
    image: <ViewResultsSuccess />,
    intents: intents,
  });
};

const viewGameResultsRoute: RoutedFrames = {
  route: TARGET_ROUTES.VIEW_GAME_RESULTS,
  handler: viewGameResultsFrame,
};

export default viewGameResultsRoute;
