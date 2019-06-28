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

    // Set panel color according to theme preference
    // /playlistInput
    const panelBgColor = preferDarkTheme
      ? getRootCssVariable("--panel-dark-bg")
      : getRootCssVariable("--panel-light-bg");

    setRootCssVariable("--panel-bg-color", panelBgColor);
  }
}

export default function* userPreferencesSaga() {
  yield all([setPreferDarkThemeWatcher()]);
}
