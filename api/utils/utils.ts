import { formatDistanceToNow } from "date-fns";

// Rumbles start every hour on the hours
export const timeUntilNextRumble = () => {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1);
  nextHour.setMinutes(0);
  nextHour.setSeconds(0);
  return formatDistanceToNow(nextHour);
};

export const minifyAddress = (address: string): string =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;
