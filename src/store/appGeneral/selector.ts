import { createSelector } from "reselect";
import { AppState } from "store";

const selectAppGeneral = (state: AppState) => state.appGeneral;

export const selectLatestAppVersion = createSelector(
  selectAppGeneral,
  (appGeneral) => appGeneral.appUpdates.slice(-1)[0].version
);
