import { Prisma } from ".prisma/client";
import { GameEndType } from "../../../../RumbleRaffle/types/index";

/**
 * This will return the actual values that are being paid out on completion of the game.
 */
export type PrizePayouts = {
  /**
   * Prize payout for the winner.
   */
  winner: number;
  /**
   * Prize payout for all other individuals that had kills.
   */
  kills: { [playerId: string]: number };
  /**
   * Total prize paid out
   */
  total: number;
};

/**
 * Used for creating payouts
 */
export type PayoutTemplateType = {
  /**
   * Contract address the the room is using
   */
  contract_address: string;
  /**
   * Room params id
   */
  room_params_id: string;
  /**
   * Players public address
   */
  public_address: string;
  /**
   * Payment amount
   */
  payment_amount: number;
  /**
   * Reason for the payment
   */
  payment_reason: Prisma.PayoutsCreateInput["payment_reason"];
  /**
   * Notes to help determine reason later
   */
  notes: string;
};

type BetaPayoutTypes = {
  WINNER: number;
  RUNNER_UPS: number[];
  KILLS: number;
  JOIN_GAME: number;
};

/**
 * Variables for the beta payouts.
 * These are all whole numbers, not percentages.
 */
const BETA_PAYOUTS_VARS: BetaPayoutTypes = {
  WINNER: 5,
  RUNNER_UPS: [0],
  KILLS: 1,
  JOIN_GAME: 1,
};

export const payoutTemplate = ({
  contract_address,
  room_params_id,
  public_address,
  payment_amount,
  payment_reason,
  notes,
}: PayoutTemplateType): Prisma.PayoutsCreateManyInput => ({
  public_address,
  payment_amount,
  payment_reason,
  notes,
  // These are not done until a later time.
  payment_completed: false,
  payment_completed_at: null,
  payment_transaction_hash: null,
  room_params_id,
  payment_contract_id: contract_address,
});

/**
 * Helper function to get the notes of a payout.
 */
export const payoutNotesTemplate = (
  {
    id,
    gameKills,
    gamePayouts,
  }: {
    id: string;
    gameKills: GameEndType["gameKills"];
    gamePayouts: PrizePayouts;
  },
  extraNotes?: string,
) =>
  `${
    getKillNotes(getKillCount(id, gameKills), getKillPayout(id, gamePayouts))
  }${extraNotes ? ` ${extraNotes}` : ""}`;

/**
 * Helper function that returns all of the payout information for a game.
 */
export const selectPayoutFromGameData = (
  {
    gameWinner,
    gameKills,
    contract_address,
    room_params_id,
  }: {
    gameWinner: GameEndType["gameWinner"];
    gameKills: GameEndType["gameKills"];
    contract_address: string;
    room_params_id: string;
  },
): Prisma.PayoutsCreateManyInput[] => {
  // Calculates the room payouts
  const gamePayouts = calculatePayouts(gameKills);

  const payouts: Prisma.PayoutsCreateManyInput[] = [];
  // Create winner payout object
  const winnerPayout: Prisma.PayoutsCreateManyInput = payoutTemplate({
    public_address: gameWinner?.id!,
    contract_address,
    room_params_id,
    payment_amount: gamePayouts.winner +
      getKillPayout(gameWinner?.id!, gamePayouts),
    payment_reason: "winner",
    notes: payoutNotesTemplate(
      { id: gameWinner?.id!, gameKills, gamePayouts },
      `Winner payout: ${gamePayouts.winner}.`,
    ),
  });
  // Push the object to the payouts.
  payouts.push(winnerPayout);

  const listOfWinners = payouts.map((obj) => obj.public_address);
  // Filter all of the winners / runnerups out of the kill payouts list.
  const filteredKillIds = Object.keys(gamePayouts.kills).filter(
    (id) => listOfWinners.indexOf(id) === -1,
  );
  // Loop through all the payout kills and set the payout data.
  filteredKillIds.forEach((public_address) => {
    const killPayout: Prisma.PayoutsCreateManyInput = payoutTemplate({
      public_address,
      contract_address,
      room_params_id,
      payment_amount: getKillPayout(public_address, gamePayouts),
      payment_reason: "kills",
      notes: payoutNotesTemplate({
        id: public_address,
        gameKills,
        gamePayouts,
      }),
    });
    // Push the kill payout
    payouts.push(killPayout);
  });

  // Filter so we only add payouts when there is one. Also filter any that don't start with 0x, as that won't be a public address.
  return payouts
    // the fancy `+` in front of the payment_amount is to convert it to a number.
    .filter((payout) => +payout.payment_amount > 0)
    .filter((p) => p.public_address.startsWith("0x"));
};

/**
 * Helper function to get the kill count of a specific player in a given game.
 * @param id - id of player
 * @param gameKills - entire game kills object
 * @returns number of kills gotten
 */
const getKillCount = (id: string, gameKills: GameEndType["gameKills"]) =>
  gameKills[id] || 0;

/**
 * Helper function to get the kill payout amount of a specific player in a given game.
 * @param id
 * @param gamePayouts
 * @returns
 */
const getKillPayout = (id: string, gamePayouts: PrizePayouts): number =>
  gamePayouts.kills[id] || 0;

/**
 * Helper function to create the kill notes for to save for a player.
 * @param killCount - total amount of kills gotten
 * @param killPayout - total amount paid out for kills
 * @returns kill notes
 */
const getKillNotes = (killCount: number, killPayout: number) =>
  killCount > 0
    ? `Total kill payout: ${killPayout}. Total kill count: ${killCount}.`
    : "";

const calculatePayouts = (
  gameKills: GameEndType["gameKills"],
): PrizePayouts => {
  let tempTotal = 0;
  const payouts: PrizePayouts = {
    winner: 0,
    kills: {},
    total: 0,
  };

  // First place prize
  payouts.winner = BETA_PAYOUTS_VARS.WINNER;
  tempTotal += BETA_PAYOUTS_VARS.WINNER;

  // Loop through all the kills
  Object.keys(gameKills).forEach((playerId) => {
    const killPay = BETA_PAYOUTS_VARS.KILLS * gameKills[playerId];
    // only add them if payout is greater than 0
    killPay > 0 && (payouts.kills[playerId] = killPay);
    tempTotal += killPay;
  });

  payouts.total = tempTotal;
  return payouts;
};
