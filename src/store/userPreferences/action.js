import { SET_PREFER_DARK_THEME } from "../../utils/constants/actionConstants";

/**
 * Set user theme preference to Redux store
 * @param {boolean} isPreferDarkTheme is user prefer dark mode or not
 * @returns {SetPreferDarkThemeAction} SET_PREFER_DARK_THEME action object
 */
export const setPreferDarkTheme = (isPreferDarkTheme) => ({
  type: SET_PREFER_DARK_THEME,
  payload: {
    isPreferDarkTheme,
  },
});
