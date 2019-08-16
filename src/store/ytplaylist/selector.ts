import { createSelector } from "reselect";
import { AppState } from "store";

const selectYtplaylist = (state: AppState) => state.ytplaylist;

// ===================================================
// ===================================================
// Videos
// DEPRECATED: will be removed on next stable (v4.0)
// ===================================================
// ===================================================
export const selectVideos = createSelector(
  selectYtplaylist,
  (ytplaylist) => ytplaylist.videos
);

export const selectCheckedVideos = createSelector(
  selectYtplaylist,
  (ytplaylist) => ytplaylist.checkedVideos
);

export const selectPlayingVideos = createSelector(
  selectYtplaylist,
  (ytplaylist) => ytplaylist.playingVideos
);

export const selectVideoItems = createSelector(
  selectVideos,
  (videos) =>
    videos
      .map((video) => video.items)
      .reduce((acc, val) => [...acc, ...val], [])
);
// ===================================================
// ===================================================
// End Videos
// ===================================================
// ===================================================

/**
 * @deprecated will be removed on next stable (v4.0)
 */
export const selectListToPlay = createSelector(
  selectYtplaylist,
  (ytplaylist) => ytplaylist.listToPlay
);
