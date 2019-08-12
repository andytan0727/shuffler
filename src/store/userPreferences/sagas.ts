import { take } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";
import { SET_PREFER_DARK_THEME } from "utils/constants/actionConstants";
import {
  getRootCssVariable,
  setRootCssVariable,
} from "utils/helper/stylesHelper";

import { setPreferDarkTheme } from "./action";

type setPreferDarkThemeAction = ActionType<typeof setPreferDarkTheme>;

let _isPreferDarkTheme = true; // default to true as per store initial state

/**
 * Set CSS custom properties with the name of cssPropName
 * according to the current user preferred mode (dark/light)
 *
 * @param cssPropName CSS custom properties name
 */
const _setCSSWithPreferredMode = (cssPropName: string) => {
  const extractedPropName = /\w+\S+/g.exec(cssPropName);

  setRootCssVariable(
    cssPropName,
    _isPreferDarkTheme
      ? getRootCssVariable(`--dark-${extractedPropName}`)
      : getRootCssVariable(`--light-${extractedPropName}`)
  );
};

export function* setPreferDarkThemeWatcher() {
  while (true) {
    const action: setPreferDarkThemeAction = yield take(SET_PREFER_DARK_THEME);
    _isPreferDarkTheme = action.payload.isPreferDarkTheme;

    // ===============================
    // General
    // ===============================
    // Set text color
    _setCSSWithPreferredMode("--text-color");

    // Set contrast text color for easier vision
    _setCSSWithPreferredMode("--contrast-text-color");

    // Set background color
    _setCSSWithPreferredMode("--bg-color");

    // Set contrast background color for easier vision
    _setCSSWithPreferredMode("--contrast-bg-color");

    // Set background color for rgba
    _setCSSWithPreferredMode("--bg-color-rgb");

    // Set gradient background image
    _setCSSWithPreferredMode("--gradient-bg");

    // Set border color
    _setCSSWithPreferredMode("--border-color");

    // Set hover bg color
    _setCSSWithPreferredMode("--hover-bg");

    // Set theme color
    _setCSSWithPreferredMode("--theme-color");

    // ===============================
    // /playlistInput route
    // ===============================
    // Set panel bg color
    _setCSSWithPreferredMode("--panel-bg-color");

    // Set gradient panel bg color
    _setCSSWithPreferredMode("--panel-gradient-bg");

    // Set search input color according to theme preference
    _setCSSWithPreferredMode("--search-input-bg-color");

    // Set toggle mark mode switch styles
    _setCSSWithPreferredMode("--switch-shadow-color");
    _setCSSWithPreferredMode("--switch-icon");
    _setCSSWithPreferredMode("--switch-text");

    // ===============================
    // /player/ytplayer route
    // ===============================
    // Set YT player playlist bg color
    _setCSSWithPreferredMode("--yt-player-list-bg");
  }
}

export default function* userPreferencesSaga() {
  yield setPreferDarkThemeWatcher();
}
