export const minifyAddress = (address: string): string =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;
