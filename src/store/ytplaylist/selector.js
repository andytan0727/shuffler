import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";

/**
 * Selector of ytplaylist state from Redux root/app state
 *
 * @param {AppState} state
 */
const ytplaylistSelector = (state) => state.ytplaylist;

// ===================================================
// Playlists
// ===================================================
export const playlistsSelector = createSelector(
  ytplaylistSelector,
  (ytplaylist) => ytplaylist.playlists
);

export const checkedPlaylistsSelector = createSelector(
  ytplaylistSelector,
  (ytplaylist) => ytplaylist.checkedPlaylists
);

export const playingPlaylistsSelector = createSelector(
  ytplaylistSelector,
  (ytplaylist) => ytplaylist.playingPlaylists
);

export const playlistItemsSelector = createCachedSelector(
  playlistsSelector,
  /**
   * @param {AppState} _
   * @param {number | string} playlistId
   */
  (_, playlistId) => playlistId,
  (playlists, id) => playlists[id].items
)((_, id) => `playlists:${id}`);

// ===================================================
// Videos
// ===================================================
export const videosSelector = createSelector(
  ytplaylistSelector,
  (ytplaylist) => ytplaylist.videos
);

export const checkedVideosSelector = createSelector(
  ytplaylistSelector,
  (ytplaylist) => ytplaylist.checkedVideos
);

export const playingVideosSelector = createSelector(
  ytplaylistSelector,
  (ytplaylist) => ytplaylist.playingVideos
);

export const videoItemsSelector = createSelector(
  videosSelector,
  (videos) =>
    videos
      .map((video) => video.items)
      .reduce((acc, val) => [...acc, ...val], [])
);

// ===================================================
// List To Play
// ===================================================
export const listToPlaySelector = createSelector(
  ytplaylistSelector,
  (ytplaylist) => ytplaylist.listToPlay
);
