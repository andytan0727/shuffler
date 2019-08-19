import { createSelector } from "reselect";
import { AppState } from "store";

export const selectFilteredState = (state: AppState) =>
  state.ytplaylist.filtered;

export const selectFilteredSnippets = createSelector(
  selectFilteredState,
  (filtered) => filtered.snippets
);
