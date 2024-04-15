import type {
  ActivityTypes,
  allPlayersObj,
  PlayerType,
  GameEndType,
  ActivitiesObjType,
  GameActivityLogsType,
} from "./index.js";

/**
 * Constructor typings
 */
export type SetupType = {
  activities: ActivitiesObjType;
  params: Pick<RumbleInterface, "chanceOfPve" | "chanceOfRevive">;
  initialPlayers: PlayerType[];
};

/**
 * Interface of the instantiated Rumble.
 */
export interface RumbleInterface {
  /**
   * Activities available to choose from.
   */
  activities: ActivitiesObjType;

  /** ----Values for setting up the rumble environment---- */
  /**
   * Percent chance of a PVE random. Must be between 0 and 100.
   * Default is 30%
   */
  chanceOfPve: number;
  /**
   * Percent chance of someone to revive. Must be between 0 and 100.
   * Default is 5%
   */
  chanceOfRevive: number;
  /**
   * The maximum amount of activities a user should be able to participate in each round.
   * Excluding revives.
   * Default is 2.
   */
  maxActivitiesPerRound: number;

  /** ----Values used before game starts---- */

  // All players of the given game as an object.
  allPlayers: allPlayersObj;
  // All player ids of the given game as an array.
  allPlayerIds: string[];
  // Total amount of players
  totalPlayers: number;

  /** ----Values used when game in play--- */

  // Storing the activity logs for each round played.
  gameActivityLogs: GameActivityLogsType;
  // Total kills in the game
  gameKills: { [playerId: string]: number };
  // The entire list of participants, excluding the winner, ordered by their placement.
  gameRunnerUps: PlayerType[];
  // Has game already been started.
  gameStarted: boolean;
  // The game winner.
  gameWinner: PlayerType | null;
  // All players still in the game
  playersRemainingIds: string[];
  // Players who have been slain.
  playersSlainIds: string[];
  // What round we are on.
  roundCounter: number;

  /** ----FUNCTIONS--- */

  /**
   * On add player we want to:
   * - Add the player ID to playersRemainingIds arr
   * - Add player to allPlayers object
   * - Call setPlayers method
   * @param newPlayer
   * @returns
   */
  addPlayer: (newPlayer: PlayerType) => PlayerType[] | null;
  /**
   * Clears all players from the game state.
   */
  clearPlayers: () => void;
  /**
   * Get's the entire class for debuggin.
   */
  debug: () => any;
  /**
   * Getter for the activity logs.
   * @returns activity logs
   */
  getActivityLog: () => GameActivityLogsType;
  /**
   * Get all players in the game
   */
  getAllPlayers: () => PlayerType[];
  /**
   * Getter for the game winner and runner ups.
   * @returns the game winner and runner ups.
   */
  getGameWinner: () => {
    winner: PlayerType | null;
    runnerUps: PlayerType[] | null;
  };
  /**
   * Gets the player object by the id
   * @param id - id of player
   * @returns player object
   */
  getPlayerById: (id: string) => PlayerType;
  /**
   * Remove a player from the rumble.
   * @param playerId - playerID to remove
   * @returns - the remaining players
   */
  removePlayer: (playerId: string) => PlayerType[] | null;
  /**
   * Helper that replaces the "PLAYER_#" placeholders in activity description with the actual players name.
   * @param activity - given activity
   * @param playerIds - player ids completing the activity
   * @returns the activity description string
   */
  replaceActivityDescPlaceholders: (
    activity: ActivityTypes,
    playerIds: string[]
  ) => string;
  /**
   * Clears all the activity logs and restarts the game.
   * Keeps all players entered.
   */
  restartGame: () => Promise<GameEndType>;
  /**
   * Will complete the game by itself without needing to press next rounds, etc.
   */
  startAutoPlayGame: () => Promise<GameEndType>;
}
