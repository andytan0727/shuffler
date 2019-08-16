import { createSelector } from "reselect";
import { AppState } from "store";

const selectYtplaylist = (state: AppState) => state.ytplaylist;

/**
 * @deprecated will be removed on next stable (v4.0)
 */
export const selectListToPlay = createSelector(
  selectYtplaylist,
  (ytplaylist) => ytplaylist.listToPlay
);
