import map from "lodash/map";
import pick from "lodash/pick";
import createCachedSelector from "re-reselect";
import { createSelector } from "reselect";
import { AppState } from "store";

import {
  NormPlaylistsEntities,
  NormVideosEntities,
  PlaylistItemSnippet,
} from "./types";
import { getSnippetFromItemId } from "./utils";

export const selectNormPlaylistsEntities = (state: AppState) =>
  state.ytplaylistNormed.playlists.entities;
export const selectNormPlaylistsResult = (state: AppState) =>
  state.ytplaylistNormed.playlists.result;
export const selectNormVideosEntities = (state: AppState) =>
  state.ytplaylistNormed.videos.entities;
export const selectNormListToPlayEntities = (state: AppState) =>
  state.ytplaylistNormed.listToPlay.entities;
export const selectNormListToPlayResult = (state: AppState) =>
  state.ytplaylistNormed.listToPlay.result;

// =====================================
// =====================================
// Playlists
// =====================================
// =====================================
export const selectAllNormPlaylistItems = createSelector(
  selectNormPlaylistsEntities,
  (entities) => entities.playlistItems
);

export const selectAllNormPlaylistSnippets = createSelector(
  selectNormPlaylistsEntities,
  (entities) => entities.snippets
);

export const selectNormPlaylistById = createCachedSelector(
  selectNormPlaylistsEntities,
  (_: never, playlistId: string) => playlistId,
  (entities, playlistId) => entities.playlists[playlistId]
)((_, playlistId) => `playlist-playlistId-${playlistId}`);

export const selectNormPlaylistNameById = createCachedSelector(
  selectNormPlaylistsEntities,
  (_: never, playlistId: string) => playlistId,
  (entities, id) => entities.playlists[id].name
)((_, id) => `playlist-name-${id}`);

export const selectNormPlaylistItemIdsById = createCachedSelector(
  selectNormPlaylistsEntities,
  (_: never, playlistId: string) => playlistId,
  (entities, id) => entities.playlists[id].items
)((_, playlistId) => `playlists-${playlistId}`);

export const selectNormPlaylistSnippetIdsByItemIds = createCachedSelector(
  selectNormPlaylistItemIdsById,
  selectAllNormPlaylistItems,
  (itemIds, playlistItems) =>
    itemIds.map((id: string) => playlistItems[id].snippet)
)((_, id) => `SIDS-IID-${id}`);

export const selectNormPlaylistSnippetByItemId = createCachedSelector(
  selectNormPlaylistsEntities,
  (_: never, playlistItemId: string) => playlistItemId,
  (entities, itemId) =>
    getSnippetFromItemId(entities as NormPlaylistsEntities, itemId)
)((_, itemId) => `playlistItem-${itemId}`);

export const selectNormPlaylistSnippetsBySnippetIds = createCachedSelector(
  [selectNormPlaylistSnippetIdsByItemIds, selectAllNormPlaylistSnippets],
  (snippetIds, snippets) =>
    map(pick(snippets, snippetIds), (val, key) => ({
      id: key,
      ...val,
    }))
)((_, id) => `PS-SID-${id}`);

export const selectNormPlaylistIdByItemId = createCachedSelector(
  selectNormPlaylistSnippetByItemId,
  (snippet) => (snippet as PlaylistItemSnippet).playlistId
)((_, itemId) => `playlistId-playlistItemId-${itemId}`);

// =====================================
// =====================================
// Videos
// =====================================
// =====================================
export const selectAllNormVideoSnippets = createSelector(
  selectNormVideosEntities,
  (entities) => entities.snippets
);

export const selectAllNormVideoSnippetsAsArray = createSelector(
  selectAllNormVideoSnippets,
  (snippets) => map(snippets, (val, key) => ({ id: key, ...val }))
);

export const selectAllNormVideoItemIds = createSelector(
  selectNormVideosEntities,
  (entities) => Object.keys(entities.videoItems)
);

export const selectNormVideoItemIdsByVideoId = createCachedSelector(
  selectNormVideosEntities,
  (_: never, videoId: string) => videoId,
  (entities, videoId) => entities.videos[videoId].items
)((_, id) => `itemIds-videoId-${id}`);

export const selectNormVideoSnippetByItemId = createCachedSelector(
  selectNormVideosEntities,
  (_: never, itemId: string) => itemId,
  (entities, itemId) =>
    getSnippetFromItemId(entities as NormVideosEntities, itemId)
)((_, itemId) => `snippet-itemId-${itemId}`);

export const selectNormVideoSnippetsByItemIds = createCachedSelector(
  selectNormVideosEntities,
  (_: never, itemIds: string[]) => itemIds,
  (entities, itemIds) => {
    const snippetIds = itemIds.map(
      (itemId) => entities.videoItems[itemId].snippet
    );

    return snippetIds.map((snippetId) => entities.snippets[snippetId]);
  }
)((_, id) => `snippets-itemId-${id.toString()}`);

export const selectNormVideoIdByItemId = createCachedSelector(
  selectNormVideosEntities,
  (_: never, itemId: string) => itemId,
  (entities, itemId) => entities.videoItems[itemId].id
)((_, itemId) => `videoId-itemId-${itemId}`);

// =====================================
// =====================================
// List To Play
// =====================================
// =====================================
export const selectNormListToPlayPlaylistItems = createSelector(
  selectNormListToPlayEntities,
  (entities) => entities.playlistItems
);

export const selectNormListToPlayPlaylistItemByItemId = createCachedSelector(
  selectNormListToPlayPlaylistItems,
  (_: never, itemId: string) => itemId,
  (playlistItems, itemId) => playlistItems[itemId]
)((_, id) => `LTP-PI-${id}`);

export const selectNormListToPlayVideoItems = createSelector(
  selectNormListToPlayEntities,
  (entities) => entities.videoItems
);

export const selectNormListToPlayVideoItemByItemId = createCachedSelector(
  selectNormListToPlayVideoItems,
  (_: never, itemId: string) => itemId,
  (videoItems, itemId) => videoItems[itemId]
)((_, id) => `LTP-VI-${id}`);

export const selectAllNormListToPlayItemIds = createSelector(
  selectNormListToPlayResult,
  (results) => results.map((result) => result.id)
);

// =====================================
// =====================================
// General
// =====================================
// =====================================

/**
 * Select snippet from either playlist/video side based on the present of
 * playlistId property in snippet.
 * If playlistId exists then the snippet is belong to playlist, and vice versa.
 *
 */
export const selectNormSnippetByItemId = createCachedSelector(
  selectNormPlaylistSnippetByItemId,
  selectNormVideoSnippetByItemId,
  (playlistSnippet, videoSnippet) =>
    playlistSnippet ? playlistSnippet : videoSnippet
)((_: never, itemId) => `ltp-snippet-itemId-${itemId}`);
