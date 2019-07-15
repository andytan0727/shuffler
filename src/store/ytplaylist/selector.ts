import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";
import { AppState } from "store";

const ytplaylistSelector = (state: AppState) => state.ytplaylist;

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
  (_: never, playlistId: number) => playlistId,
  (playlists, id) => playlists[id].items
)((_, id) => `playlists:${id}`);

// ===================================================
// ===================================================
// Videos
// ===================================================
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
      // @ts-ignore
      .map((video) => video.items)
      // @ts-ignore
      .reduce((acc, val) => [...acc, ...val], [])
);

// ===================================================
// List To Play
// ===================================================
export const listToPlaySelector = createSelector(
  ytplaylistSelector,
  (ytplaylist) => ytplaylist.listToPlay
);
