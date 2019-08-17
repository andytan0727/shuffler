import map from "lodash/map";
import pick from "lodash/pick";
import createCachedSelector from "re-reselect";
import { createSelector } from "reselect";
import { AppState } from "store";

import { NormPlaylistsEntities, PlaylistItemSnippet } from "./types";
import { getSnippetFromItemId } from "./utils";

export const selectNormPlaylistsEntities = (state: AppState) =>
  state.ytplaylistNormed.playlists.entities;
export const selectNormPlaylistsResult = (state: AppState) =>
  state.ytplaylistNormed.playlists.result;

export const selectAllNormPlaylistItems = createSelector(
  selectNormPlaylistsEntities,
  (entities) => entities.playlistItems
);

export const selectAllNormPlaylists = createSelector(
  selectNormPlaylistsEntities,
  (entities) => entities.playlists
);

export const selectAllNormPlaylistSnippets = createSelector(
  selectNormPlaylistsEntities,
  (entities) => entities.snippets
);

export const selectNormPlaylistById = createCachedSelector(
  selectNormPlaylistsEntities,
  (_: AppState, playlistId: string) => playlistId,
  (entities, playlistId) => entities.playlists[playlistId]
)((_, playlistId) => `playlist-playlistId-${playlistId}`);

export const selectNormPlaylistNameById = createCachedSelector(
  selectNormPlaylistsEntities,
  (_: AppState, playlistId: string) => playlistId,
  (entities, id) => entities.playlists[id].name
)((_, id) => `playlistName-playlistId-${id}`);

export const selectNormPlaylistItemIdsByPlaylistId = createCachedSelector(
  selectNormPlaylistsEntities,
  (_: AppState, playlistId: string) => playlistId,
  (entities, id) => entities.playlists[id].items
)((_, playlistId) => `playlistItemIds-playlistId-${playlistId}`);

export const selectNormPlaylistSnippetIdsByPlaylistId = createCachedSelector(
  selectNormPlaylistItemIdsByPlaylistId,
  selectAllNormPlaylistItems,
  (itemIds, playlistItems) =>
    itemIds.map((id: string) => playlistItems[id].snippet)
)((_, playlistId) => `playlistSnippetIds-playlistId-${playlistId}`);

export const selectNormPlaylistSnippetByItemId = createCachedSelector(
  selectNormPlaylistsEntities,
  (_: AppState, playlistItemId: string) => playlistItemId,
  (entities, itemId) =>
    getSnippetFromItemId(entities as NormPlaylistsEntities, itemId)
)((_, itemId) => `playlistSnippet-itemId-${itemId}`);

export const selectNormPlaylistSnippetsByPlaylistId = createCachedSelector(
  [selectNormPlaylistSnippetIdsByPlaylistId, selectAllNormPlaylistSnippets],
  (snippetIds, snippets) =>
    map(pick(snippets, snippetIds), (val, key) => ({
      id: key,
      ...val,
    }))
)((_, playlistId) => `playlistSnippets-playlistId-${playlistId}`);

/**
 * Select playlistId by itemId.
 *
 * **Note: returned result might be undefined.**
 */
export const selectNormPlaylistIdByItemId = createCachedSelector(
  selectNormPlaylistSnippetByItemId,
  (snippet) => snippet && (snippet as PlaylistItemSnippet).playlistId
)((_, itemId) => `playlistId-playlistItemId-${itemId}`);

export const selectNormPlaylistAllInPlayingById = createCachedSelector(
  selectNormPlaylistById,
  (playlist) => !!(playlist && playlist.allInPlaying)
)((_, playlistId) => `allInPlaying-playlistId-${playlistId}`);

export const selectPartialInPlayingById = createCachedSelector(
  selectNormPlaylistById,
  (playlist) => !!(playlist && playlist.partialInPlaying)
)((_, playlistId) => `partialInPlaying-playlistId-${playlistId}`);
