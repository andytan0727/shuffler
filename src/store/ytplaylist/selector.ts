import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";
import { AppState } from "store";

const selectYtplaylist = (state: AppState) => state.ytplaylist;

// ===================================================
// Playlists
// ===================================================
export const selectPlaylists = createSelector(
  selectYtplaylist,
  (ytplaylist) => ytplaylist.playlists
);

export const selectCheckedPlaylists = createSelector(
  selectYtplaylist,
  (ytplaylist) => ytplaylist.checkedPlaylists
);

export const selectPlayingPlaylists = createSelector(
  selectYtplaylist,
  (ytplaylist) => ytplaylist.playingPlaylists
);

export const selectPlaylistItems = createCachedSelector(
  selectPlaylists,
  (_: never, playlistId: number) => playlistId,
  (playlists, id) => playlists[id].items
)((_, id) => `playlists:${id}`);

export const selectPlaylistName = createCachedSelector(
  selectPlaylists,
  (_: never, playlistId: string) => playlistId,
  (playlists, playlistId) =>
    playlists.filter((playlist) => playlist.id === playlistId)[0].name
)((_, id) => `playlist-name-${id}`);

// ===================================================
// ===================================================
// Videos
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
      // @ts-ignore
      .map((video) => video.items)
      // @ts-ignore
      .reduce((acc, val) => [...acc, ...val], [])
);

// ===================================================
// List To Play
// ===================================================
export const selectListToPlay = createSelector(
  selectYtplaylist,
  (ytplaylist) => ytplaylist.listToPlay
);