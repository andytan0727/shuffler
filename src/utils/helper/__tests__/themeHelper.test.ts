import { purple } from "@material-ui/core/colors";

import * as stylesHelper from "../stylesHelper";
import { createShufflerMuiTheme } from "../themeHelper";

type BgPaletteColors =
  | "black"
  | "blackLight"
  | "blackDark"
  | "softBlack"
  | "lightGrey"
  | "darkGrey";

const bgPalette = {
  black: "#1a1a1a",
  blackLight: "#4e4b53",
  blackDark: "#0d0d0d",
  softBlack: "#414a4c",
  lightGrey: "#2a2a2a",
  darkGrey: "#282828",
};

const typography = {
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
};

const mockGetRootCssVariable = jest.spyOn(stylesHelper, "getRootCssVariable");
mockGetRootCssVariable.mockImplementation((prop: string): string => {
  const propertyName = prop.slice(2) as BgPaletteColors;
  return bgPalette[propertyName];
});

describe("testing stylesHelper", () => {
  const customDarkModeOptions = {
    palette: {
      type: "dark" as const,
    },
  };
  const customLightModeOptions = {
    palette: {
      type: "light" as const,
    },
  };

  afterEach(() => {
    // reset mockGetRootCssVariable call counts after each test
    jest.clearAllMocks();
  });

  test("theme should contain background palette with custom colors", () => {
    const theme = createShufflerMuiTheme({});

    // getRootCssVariable fun should be called 6 times
    // to get 6 colors in theme palette background
    expect(mockGetRootCssVariable).toHaveBeenCalledTimes(6);

    expect(theme.palette.background).toEqual({
      ...bgPalette,
      default: "#fafafa",
      paper: "#fff",
    });
  });

  test("theme should contain custom typography font family", () => {
    const theme = createShufflerMuiTheme({});

    // getRootCssVariable fun should be called 6 times
    // to get 6 colors in theme palette background
    expect(mockGetRootCssVariable).toHaveBeenCalledTimes(6);

    expect(theme.typography.fontFamily).toEqual(typography.fontFamily);
  });

  test("should create MUI dark theme for shuffler with predefined theme correctly", () => {
    const darkTheme = createShufflerMuiTheme(customDarkModeOptions);

    // getRootCssVariable fun should be called 6 times
    // to get 6 colors in theme palette background
    expect(mockGetRootCssVariable).toHaveBeenCalledTimes(6);

    expect(darkTheme).toMatchObject({
      palette: {
        type: "dark",
        primary: { main: purple[800] },
        secondary: { main: purple["A200"] },
        background: bgPalette,
      },
      typography,
    });

    // default and paper color changes in dark mode
    expect(darkTheme.palette.background).toEqual({
      ...bgPalette,
      default: "#303030",
      paper: "#424242",
    });
  });

  test("should create MUI light theme for shuffler with predefined theme correctly", () => {
    const lightTheme = createShufflerMuiTheme(customLightModeOptions);

    // getRootCssVariable fun should be called 6 times
    // to get 6 colors in theme palette background
    expect(mockGetRootCssVariable).toHaveBeenCalledTimes(6);

    expect(lightTheme).toMatchObject({
      palette: {
        type: "light",
        primary: { main: purple[800] },
        secondary: { main: purple["A200"] },
        background: bgPalette,
      },
      typography,
    });

    expect(lightTheme.palette.background).toEqual({
      ...bgPalette,
      default: "#fafafa",
      paper: "#fff",
    });
  });
});
