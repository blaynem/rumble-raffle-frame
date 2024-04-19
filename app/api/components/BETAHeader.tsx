/** @jsxImportSource frog/jsx */

import { Box, Heading, Text } from "../utils/ui";

export const BETAHeading = () => (
  <Box flexDirection="row" alignItems="center" gap={"8"}>
    <Heading color="rumblePrimary">Rumble Raffle</Heading>
    <Box flexDirection="row">
      <Text color="rumblePrimary">((</Text>
      <Text>BETA</Text>
      <Text color="rumblePrimary">))</Text>
    </Box>
  </Box>
);
