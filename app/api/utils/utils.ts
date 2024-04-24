import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

// Rumbles start every hour on the hours
export const timeUntilNextRumble = () => {
  const now = new Date();
  const utcOffset = now.getTimezoneOffset();
  const pstOffset = 480; // PST is UTC-8 hours
  const differenceFromPST = pstOffset - utcOffset;

  let startTime = new Date(now);
  startTime.setMinutes(startTime.getMinutes() + differenceFromPST);
  startTime.setHours(12, 0, 0, 0);

  if (now >= startTime) {
    startTime.setDate(startTime.getDate() + 1);
    startTime = new Date(startTime); // Recreate date object to reset time correctly
    startTime.setMinutes(startTime.getMinutes() + differenceFromPST);
    startTime.setHours(12, 0, 0, 0);
  }

  return `Next Rumble ${
    formatDistanceToNow(startTime, { addSuffix: true, includeSeconds: true })
  }.`;
};

export const minifyAddress = (address: string): string =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;
