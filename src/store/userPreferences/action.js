import { SET_PREFER_DARK_THEME } from "../../utils/constants/actionConstants";

/**
 * Set user theme preference to Redux store
 * @param {boolean} persist persist to indexedDB
 * @param {boolean} isPreferDarkTheme is user prefer dark mode or not
 * @returns SET_PREFER_DARK_THEME action object for redux store
 */
const setPreferDarkTheme = ({ persist, isPreferDarkTheme }) => ({
  type: SET_PREFER_DARK_THEME,
  payload: {
    persist,
    isPreferDarkTheme,
  },
});

export { setPreferDarkTheme };
