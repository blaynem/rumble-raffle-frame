import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

// Rumbles start every hour on the hours
export const timeUntilNextRumble = () => {
  const now = new Date();
  const utcOffset = now.getTimezoneOffset(); // Offset in minutes between UTC and local time
  const pstOffset = 480; // PST is UTC-8 hours, which is 480 minutes
  const differenceFromPST = utcOffset + pstOffset; // Calculate total offset from PST

  // Start time is at noon PST every day
  const startTime = new Date(now);
  startTime.setMinutes(startTime.getMinutes() + differenceFromPST); // Convert local time to PST
  startTime.setHours(12, 0, 0, 0); // Set time to noon PST

  if (now.getTime() > startTime.getTime()) {
    // If the current time in PST has already passed noon, set the next rumble to the following day
    startTime.setDate(startTime.getDate() + 1);
  }

  // Calculate the difference in minutes and return
  return `Next Rumble ${
    formatDistanceToNow(startTime, { addSuffix: true, includeSeconds: true })
  }.`;
};

export const minifyAddress = (address: string): string =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;
