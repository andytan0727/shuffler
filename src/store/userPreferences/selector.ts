import { createSelector } from "reselect";
import { AppState } from "store";

export const selectUserPreferences = (state: AppState) => state.userPreferences;

export const selectPreferDarkTheme = createSelector(
  selectUserPreferences,
  (userPreferences) => userPreferences.preferDarkTheme
);
