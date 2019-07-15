import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";
import map from "lodash/map";
import pick from "lodash/pick";
import { AppState } from "store";
import { VideosEntities } from "./types";

const ytplaylistSelector = (state: AppState) => state.ytplaylist;
const normPlaylistsEntitiesSelector = (state: AppState) =>
  state.ytplaylistNormalized.playlists.entities;
const normVideosEntitiesSelector = (state: AppState): VideosEntities =>
  state.ytplaylistNormalized.videos.entities;

// ===================================================
// Playlists
// ===================================================
export const playlistsSelector = createSelector(
  ytplaylistSelector,
  (ytplaylist) => ytplaylist.playlists
);

export const allNormPlaylistItems = createSelector(
  normPlaylistsEntitiesSelector,
  (entities) => entities.playlistItems
);

export const allNormPlaylistSnippets = createSelector(
  normPlaylistsEntitiesSelector,
  (entities) => entities.snippets
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

export const normPlaylistItemIdsSelector = createCachedSelector(
  normPlaylistsEntitiesSelector,
  (_: never, playlistId: string) => playlistId,
  (entities, id) => entities.playlists[id].items
)((_, playlistId) => `playlists-${playlistId}`);

export const normPlaylistSnippetIdsSelector = createCachedSelector(
  normPlaylistItemIdsSelector,
  allNormPlaylistItems,
  (itemIds, playlistItems) =>
    itemIds.map((id: string) => playlistItems[id].snippet)
)((_, id) => id);

export const normPlaylistSnippetSelector = createCachedSelector(
  normPlaylistsEntitiesSelector,
  (_: never, playlistItemId: string) => playlistItemId,
  (entities, itemId) => {
    const snippetId = entities.playlistItems[itemId].snippet;

    return entities.snippets[snippetId];
  }
)((_, itemId) => `playlistItem-${itemId}`);

export const normPlaylistSnippetsSelector = createCachedSelector(
  [normPlaylistSnippetIdsSelector, allNormPlaylistSnippets],
  (snippetIds, snippets) =>
    map(pick(snippets, snippetIds), (val, key) => ({
      id: key,
      ...val,
    }))
)((_, id) => id);

// ===================================================
// ===================================================
// Videos
// ===================================================
// ===================================================
export const videosSelector = createSelector(
  ytplaylistSelector,
  (ytplaylist) => ytplaylist.videos
);

export const allNormVideoSnippets = createSelector(
  normVideosEntitiesSelector,
  (entities) => entities.snippets
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

export const normVideoItemIdsSelector = createSelector(
  normVideosEntitiesSelector,
  (entities) => Object.keys(entities.videoItems)
);

export const normVideoItemSnippetSelector = createCachedSelector(
  normVideosEntitiesSelector,
  (_: never, videoItemId: string) => videoItemId,
  (entities, itemId) => {
    const snippetId = entities.videoItems[itemId].snippet;

    return entities.snippets[snippetId];
  }
)((_, itemId) => `videoItem-${itemId}`);

export const normVideoSnippetsSelector = createSelector(
  allNormVideoSnippets,
  (snippets) => map(snippets, (val, key) => ({ id: key, ...val }))
);

// ===================================================
// List To Play
// ===================================================
export const listToPlaySelector = createSelector(
  ytplaylistSelector,
  (ytplaylist) => ytplaylist.listToPlay
);
