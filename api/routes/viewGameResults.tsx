import { Button, FrameHandler, FrameIntent } from "frog";
import { getConnectedAddressForUser } from "../utils/pinata-calls.js";
import { TARGET_ROUTES } from "../constants.js";
import { RoutedFrames } from "../types.js";
import { Box, Text, Divider, Spacer, Columns, Column } from "../utils/ui.js";
import { BETAHeading } from "../components/BETAHeader.js";
import { getPlayerCount } from "../utils/database/players.js";
import { getActiveRoomWithParams } from "../utils/database/rooms.js";
import {
  SpecificPlayerLogsFrame,
  getPlayersByIds,
  getPlayersGameLogs,
} from "../utils/database/gameLogs.js";

// TODO: Show activity details in the frame

const ViewResultsSuccess = ({
  winners,
  participated,
  entrantCount,
}: {
  /**
   * List of winners
   */
  winners: string[] | null;
  participated?: SpecificPlayerLogsFrame;
  entrantCount: number;
}) => (
  <Box grow background="rumbleBgDark" color="rumbleNone" padding={"16"}>
    <Columns gap="8">
      <Column>
        <BETAHeading />
      </Column>
      <Column>
        <Box grow alignContent="center" alignVertical="center">
          <Text>
            Next Rumble in 12 min. {entrantCount && `Entrants: ${entrantCount}`}
          </Text>
        </Box>
      </Column>
    </Columns>
    {participated && (
      <Box alignItems="center">
        <Box flexDirection="row">
          <Text>Placement: </Text>
          <Spacer size="4" />
          <Text weight="700" color="rumblePrimary">
            {participated.placement}
          </Text>
          <Spacer size="8" />
          {participated.totalKillCount > 0 && (
            <Box flexDirection="row">
              <Text>Kills: </Text>
              <Spacer size="4" />
              <Text weight="700" color="rumblePrimary">
                {participated.totalKillCount}
              </Text>
            </Box>
          )}
        </Box>
        {participated.placement == 1 && (
          <Text weight="700">Winner winner, chicken dinner!</Text>
        )}
      </Box>
    )}
    <Box
      alignVertical="center"
      alignItems="center"
      paddingLeft={"40"}
      paddingRight={"40"}
    >
      <Box width="100%">
        <Box alignItems="center">
          <Text size="24" color="rumblePrimary">
            Results
          </Text>
        </Box>
        <Divider direction="horizontal" color={"rumblePrimary"} />
        <Columns gap="8">
          <Column width="3/7">
            {winners ? (
              winners.map((winner, i) => (
                <Box
                  {...(i + 1 === participated?.placement && {
                    fontWeight: "700",
                    color: "rumblePrimary",
                    backgroundColor: "rumbleOutline",
                  })}
                >
                  <Text size="16">
                    {i + 1}: {winner}
                  </Text>
                </Box>
              ))
            ) : (
              <Text size="16">
                This is where i'd put my results... If I had any!!!
              </Text>
            )}
          </Column>
          <Column overflow="hidden">
            {participated?.activityDetails.map((activity) => {
              let emoji: string = "";
              if (activity.type === "REVIVE") emoji = "🙏";
              if (activity.type === "PVP") emoji = "⚔️";
              if (activity.type === "PVE") emoji = "🏕️";
              if (!activity.survived) emoji = "💀";
              return (
                <Text>
                  {emoji} {activity.description}
                </Text>
              );
            })}
          </Column>
        </Columns>
      </Box>
    </Box>
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
  try {
    const activeRoom = await getActiveRoomWithParams("default");
    if (!activeRoom) throw new Error("No active room found");

    const playercount = await getPlayerCount(activeRoom.params_id);
    const entrantCount = ("result" in playercount && playercount.result) || 0;
    const winners = await getPlayersByIds(activeRoom.Params.winners);

    let address = "";
    let participated: SpecificPlayerLogsFrame | undefined;
    // TODO: Make a fetch to the results API.
    // If we get the users address, we add them to the game.
    if (frameContext.verified && frameContext.frameData) {
      address = await getConnectedAddressForUser(frameContext.frameData.fid);
      participated = await getPlayersGameLogs(activeRoom.params_id, address);
    }

    return frameContext.res({
      image: (
        <ViewResultsSuccess
          participated={participated}
          winners={winners.map((w) => w.name || "Unknown")}
          entrantCount={entrantCount}
        />
      ),
      intents: intents,
    });
  } catch (error) {
    console.error("viewGameResultsFrame error: ", error);
    return frameContext.res({
      image: <ViewResultsSuccess winners={null} entrantCount={0} />,
      intents: intents,
    });
  }
};

const viewGameResultsRoute: RoutedFrames = {
  route: TARGET_ROUTES.VIEW_GAME_RESULTS,
  handler: viewGameResultsFrame,
};

export default viewGameResultsRoute;
