import { SET_PREFER_DARK_THEME } from "../../utils/constants/actionConstants";
import { PreferencesDB } from "../../utils/helper/dbHelper";

const preferencesDB = new PreferencesDB();

/**
 * Set user theme preference to Redux store
 * @param {boolean} persist persist to indexedDB
 * @param {boolean} isPreferDarkTheme is user prefer dark mode or not
 * @returns SET_PREFER_DARK_THEME thunk function for redux store
 */
const setPreferDarkTheme = ({ persist, isPreferDarkTheme }) => {
  return (dispatch) => {
    dispatch({
      type: SET_PREFER_DARK_THEME,
      payload: {
        isPreferDarkTheme,
      },
    });

    // persist to indexedDB
    if (persist) {
      preferencesDB.setDarkTheme(isPreferDarkTheme);
    }
  };
};

export { setPreferDarkTheme };
