import merge from "lodash/merge";

import { purple } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

import { getRootCssVariable } from "./stylesHelper";

/**
 * Theme factory function used to create custom theme
 * for this app (shuffler). Additional options can be
 * provided.
 *
 * @param options Additional option to be added
 * @returns custom theme with predefined values created by MUI
 */
export const createShufflerMuiTheme = (options: ThemeOptions) => {
  return createMuiTheme(
    merge(options, {
      palette: {
        primary: { main: purple[800] },
        secondary: { main: purple["A200"] },
        background: {
          black: getRootCssVariable("--black"),
          blackLight: getRootCssVariable("--blackLight"),
          blackDark: getRootCssVariable("--blackDark"),
          softBlack: getRootCssVariable("--softBlack"),
          lightGrey: getRootCssVariable("--lightGrey"),
          darkGrey: getRootCssVariable("--darkGrey"),
        },
      },
      typography: {
        fontFamily: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Roboto",
          '"Segoe UI"',
          '"Helvetica Neue"',
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "sans-serif",
        ].join(","),
      },
    })
  );
};
