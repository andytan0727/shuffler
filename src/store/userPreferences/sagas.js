import { take, all } from "redux-saga/effects";
import { SET_PREFER_DARK_THEME } from "../../utils/constants/actionConstants";
import {
  getRootCssVariable,
  setRootCssVariable,
} from "../../utils/helper/stylesHelper";

export function* setPreferDarkThemeWatcher() {
  while (true) {
    /** @type {SetPreferDarkTheme} */
    const action = yield take(SET_PREFER_DARK_THEME);
    const preferDarkTheme = action.payload.isPreferDarkTheme;

    // ===============================
    // General
    // ===============================
    // Set text color
    setRootCssVariable(
      "--text-color",
      preferDarkTheme
        ? getRootCssVariable("--dark-text")
        : getRootCssVariable("--light-text")
    );

    // Set background color
    setRootCssVariable(
      "--bg-color",
      preferDarkTheme
        ? getRootCssVariable("--dark-bg")
        : getRootCssVariable("--light-bg")
    );

    // Set border color
    setRootCssVariable(
      "--border-color",
      preferDarkTheme
        ? getRootCssVariable("--dark-border")
        : getRootCssVariable("--light-border")
    );

    // Set hover bg color
    setRootCssVariable(
      "--hover-bg",
      preferDarkTheme
        ? getRootCssVariable("--dark-hover-bg")
        : getRootCssVariable("--light-hover-bg")
    );

    // ===============================
    // /playlistInput route
    // ===============================
    // Set panel color according to theme preference
    setRootCssVariable(
      "--panel-bg-color",
      preferDarkTheme
        ? getRootCssVariable("--panel-dark-bg")
        : getRootCssVariable("--panel-light-bg")
    );

    // Set search input color according to theme preference
    setRootCssVariable(
      "--search-input-bg-color",
      preferDarkTheme
        ? getRootCssVariable("--dark-bg")
        : getRootCssVariable("--light-bg")
    );

    // ===============================
    // /player/ytplayer route
    // ===============================
    // Set YT player playlist bg color
    setRootCssVariable(
      "--yt-player-list-bg",
      preferDarkTheme
        ? getRootCssVariable("--yt-player-list-dark-bg")
        : getRootCssVariable("--yt-player-list-light-bg")
    );
  }
}

export default function* userPreferencesSaga() {
  yield all([setPreferDarkThemeWatcher()]);
}
