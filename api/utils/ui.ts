import { Vars, createSystem } from "frog/ui";

// The theme for the UI components.
// If we want to use all of the default vars, we can always import and spread the `defaultVars` from frog/ui.
export const THEME = {
  colors: {
    rumbleBgLight: "#F8F8F8",
    rumbleBgDark: "#222222",
    rumblePrimary: "#4CE3B6",
    rumbleSecondary: "#9912B8",
    rumbleTertiary: "#FDFC00",
    rumbleOutline: "#000000",
    rumbleNone: "#FFFFFF",
  },
  fonts: {
    default: [
      {
        name: "Open Sans",
        source: "google",
        weight: 400,
      },
      {
        name: "Open Sans",
        source: "google",
        weight: 600,
      },
    ],
    madimi: [
      {
        name: "Madimi One",
        source: "google",
      },
    ],
  },
} satisfies Vars; // Ensure the THEME satisfies the Vars interface so we can get proper completion.

// Creates a primitive system with the exported components and styles.
export const {
  Box,
  Columns,
  Divider,
  Icon,
  Image,
  Heading,
  HStack,
  Rows,
  Spacer,
  Text,
  VStack,
  vars,
} = createSystem(THEME);
