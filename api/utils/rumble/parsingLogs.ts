import { Prisma } from "@prisma/client";
import { GameEndType, PlayerType } from "../../../RumbleRaffle/types/index.js";

// The entire games log.
export type EntireGameLog = {
  rounds: RoundActivityLog[];
  winners: PlayerType[];
};

// The collection of activities that happens in a given game.
export type RoundActivityLog = {
  /**
   * Activities that have happened in this round.
   */
  activities: SingleActivity[];
  /**
   * What round of the acitvity log this is.
   */
  round_counter: number;
  /**
   * Amount of players remaining.
   */
  players_remaining: number;
};

// A single activity that happens in a given round.
export type SingleActivity = {
  activity_order: number;
  /**
   * Description of the activity that happens. Ex: "PLAYER_0 drank infected water and died."
   */
  description: Prisma.ActivitiesGroupByOutputType["description"];
  /**
   * Whether it is PVE, PVP, or REVIVE
   */
  environment: Prisma.ActivitiesGroupByOutputType["environment"];
  /**
   * Id of the activity
   */
  id: Prisma.ActivitiesGroupByOutputType["id"];
  /**
   * Kill count for each activity
   */
  kill_count: { [playerId: string]: number };
  /**
   * Participants of the activity
   */
  participants: PlayerType[];
};

/**
 * Parse the activity log that comes back from the Rumble game to a more readable view for the client.
 * @param gameActivityLogs
 * @param gamePlayers
 * @returns The collection of activities that happens in a given game, and the winners.
 */
export const parseActivityLogForClient = (
  gameResults: GameEndType,
): EntireGameLog => {
  const { gameActivityLogs, allPlayers } = gameResults;
  let winners: EntireGameLog["winners"] = [];
  const rounds: EntireGameLog["rounds"] = gameActivityLogs
    .map((round) => {
      // If winner is in round, that means its the WinnerLog type
      if ("winner" in round) {
        // TODO: The runnerUps is actually the entire list of players and their placement.
        //      We should rename this inside RumbleRaffle itself to be placement so it makes more sense.
        // Also we are only going to take the first 5 runner ups here.
        winners = [round.winner, ...round.runnerUps.slice(0, 5)];
        // Return null so we don't add the Winner log to the rounds
        return null;
      }
      const activities: SingleActivity[] = round.activityLog.map(
        ({ activity, activityId, participants, killCount }, index) => ({
          activity_order: index,
          description: activity.description,
          environment: activity.environment,
          id: activityId,
          participants: participants.map((id) => allPlayers[id]),
          kill_count: killCount,
        }),
      );
      return {
        activities,
        round_counter: round.roundCounter,
        players_remaining: round.playersRemainingIds.length,
      };
    })
    .filter(Boolean) as RoundActivityLog[]; // Filter out the nulls (Basically just the winners log)
  return {
    rounds,
    winners,
  };
};

/**
 * Parsing the activity log to store in the database.
 * @param gameLog
 * @param room_params_id
 * @returns
 */
export const parseActivityLogForDbPut = (
  gameLog: EntireGameLog,
  room_params_id: string,
): Prisma.GameRoundLogsCreateManyInput[] => {
  const allActivitiesInGame: Prisma.GameRoundLogsCreateManyInput[] = [];

  gameLog.rounds.forEach((round) => {
    round.activities.forEach((activity, index) => {
      const activityInRound: Prisma.GameRoundLogsCreateManyInput = {
        room_params_id,
        activity_id: activity.id,
        participants: activity.participants.map((player) => player.id),
        players_remaining: round.players_remaining,
        round_counter: round.round_counter,
        activity_order: index,
      };
      allActivitiesInGame.push(activityInRound);
    });
  });

  return allActivitiesInGame;
};
