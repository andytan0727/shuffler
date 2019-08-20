import map from "lodash/map";
import pick from "lodash/pick";
import createCachedSelector from "re-reselect";
import { createSelector } from "reselect";
import { AppState } from "store";

import { PlaylistItemSnippet, PlaylistsEntities } from "./types";
import { getSnippetFromItemId } from "./utils";

export const selectPlaylistsEntities = (state: AppState) =>
  state.ytplaylist.playlists.entities;
export const selectPlaylistsResult = (state: AppState) =>
  state.ytplaylist.playlists.result;

export const selectAllPlaylistItems = createSelector(
  selectPlaylistsEntities,
  (entities) => entities.playlistItems
);

export const selectAllPlaylists = createSelector(
  selectPlaylistsEntities,
  (entities) => entities.playlists
);

export const selectAllPlaylistSnippets = createSelector(
  selectPlaylistsEntities,
  (entities) => entities.snippets
);

export const selectPlaylistById = createCachedSelector(
  selectPlaylistsEntities,
  (_: AppState, playlistId: string) => playlistId,
  (entities, playlistId) => entities.playlists[playlistId]
)((_, playlistId) => `playlist-playlistId-${playlistId}`);

export const selectPlaylistNameById = createCachedSelector(
  selectPlaylistsEntities,
  (_: AppState, playlistId: string) => playlistId,
  (entities, id) => entities.playlists[id].name
)((_, id) => `playlistName-playlistId-${id}`);

export const selectPlaylistItemIdsByPlaylistId = createCachedSelector(
  selectPlaylistsEntities,
  (_: AppState, playlistId: string) => playlistId,
  (entities, id) => entities.playlists[id] && entities.playlists[id].items
)((_, playlistId) => `playlistItemIds-playlistId-${playlistId}`);

export const selectPlaylistSnippetIdsByPlaylistId = createCachedSelector(
  selectPlaylistItemIdsByPlaylistId,
  selectAllPlaylistItems,
  (itemIds, playlistItems) =>
    itemIds.map((id: string) => playlistItems[id].snippet)
)((_, playlistId) => `playlistSnippetIds-playlistId-${playlistId}`);

export const selectPlaylistSnippetByItemId = createCachedSelector(
  selectPlaylistsEntities,
  (_: AppState, playlistItemId: string) => playlistItemId,
  (entities, itemId) =>
    getSnippetFromItemId(entities as PlaylistsEntities, itemId)
)((_, itemId) => `playlistSnippet-itemId-${itemId}`);

export const selectPlaylistSnippetsByPlaylistId = createCachedSelector(
  [selectPlaylistSnippetIdsByPlaylistId, selectAllPlaylistSnippets],
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
export const selectPlaylistIdByItemId = createCachedSelector(
  selectPlaylistSnippetByItemId,
  (snippet) => snippet && (snippet as PlaylistItemSnippet).playlistId
)((_, itemId) => `playlistId-playlistItemId-${itemId}`);

export const selectPlaylistAllInPlayingById = createCachedSelector(
  selectPlaylistById,
  (playlist) => !!(playlist && playlist.allInPlaying)
)((_, playlistId) => `allInPlaying-playlistId-${playlistId}`);

export const selectPartialInPlayingById = createCachedSelector(
  selectPlaylistById,
  (playlist) => !!(playlist && playlist.partialInPlaying)
)((_, playlistId) => `partialInPlaying-playlistId-${playlistId}`);
