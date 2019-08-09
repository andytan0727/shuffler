import { createSelector } from "reselect";
import { AppState } from "store";

export const selectYTPlayer = (state: AppState) => state.ytplayer;

export const selectPlaying = createSelector(
  selectYTPlayer,
  (player) => player.playing
);

export const selectCurSongIdx = createSelector(
  selectYTPlayer,
  (player) => player.curSongIdx
);

export const selectRepeat = createSelector(
  selectYTPlayer,
  (player) => player.repeat
);

export const selectPlayerVars = createSelector(
  selectYTPlayer,
  (player) => player.playerVars
);
