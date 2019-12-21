import { createAction } from "typesafe-actions";
import { SET_PREFER_DARK_THEME } from "utils/constants/actionConstants";

/**
 * Set user theme preference to Redux store
 * @param isPreferDarkTheme is user prefer dark mode or not
 * @returns SET_PREFER_DARK_THEME action object
 */
export const setPreferDarkTheme = createAction(
  SET_PREFER_DARK_THEME,
  (isPreferDarkTheme: boolean) => ({
    isPreferDarkTheme,
  })
)();
