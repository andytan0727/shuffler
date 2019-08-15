import get from "lodash/get";
import map from "lodash/map";
import pick from "lodash/pick";
import createCachedSelector from "re-reselect";
import { createSelector } from "reselect";
import { AppState } from "store";

import {
  NormPlaylistsEntities,
  NormVideosEntities,
  PlaylistItemSnippet,
  VideoItemSnippet,
} from "./types";
import {
  getSnippetFromItemId,
  getSnippetWithCombinedItemId,
  isPlaylistItemExists,
} from "./utils";

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
export const selectFilteredState = (state: AppState) =>
  state.ytplaylistNormed.filtered;

// =====================================
// =====================================
// Playlists
// =====================================
// =====================================
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

export const selectAllNormVideoItems = createSelector(
  selectNormVideosEntities,
  (entities) => entities.videoItems
);

export const selectAllNormVideoItemIds = createSelector(
  selectNormVideosEntities,
  (entities) => Object.keys(entities.videoItems)
);

export const selectNormVideoItemIdsByVideoId = createCachedSelector(
  selectNormVideosEntities,
  (_: AppState, videoId: string) => videoId,
  (entities, videoId) => entities.videos[videoId].items
)((_, id) => `itemIds-videoId-${id}`);

export const selectNormVideoSnippetByItemId = createCachedSelector(
  selectNormVideosEntities,
  (_: AppState, itemId: string) => itemId,
  (entities, itemId) =>
    getSnippetFromItemId(entities as NormVideosEntities, itemId)
)((_, itemId) => `snippet-itemId-${itemId}`);

export const selectNormVideoSnippetsByItemIds = createCachedSelector(
  selectNormVideosEntities,
  (_: AppState, itemIds: string[]) => itemIds,
  (entities, itemIds) => {
    const snippetIds = itemIds.map(
      (itemId) => entities.videoItems[itemId].snippet
    );

    return snippetIds.map((snippetId) => entities.snippets[snippetId]);
  }
)((_, id) => `snippets-itemId-${id.toString()}`);

export const selectNormVideoIdByItemId = createCachedSelector(
  selectNormVideosEntities,
  (_: AppState, itemId: string) => itemId,
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
  (_: AppState, itemId: string) => itemId,
  (playlistItems, itemId) => playlistItems[itemId]
)((_, id) => `LTP-PI-${id}`);

export const selectNormListToPlayVideoItems = createSelector(
  selectNormListToPlayEntities,
  (entities) => entities.videoItems
);

export const selectNormListToPlayVideoItemByItemId = createCachedSelector(
  selectNormListToPlayVideoItems,
  (_: AppState, itemId: string) => itemId,
  (videoItems, itemId) => videoItems[itemId]
)((_, id) => `LTP-VI-${id}`);

export const selectAllNormListToPlayItemIds = createSelector(
  selectNormListToPlayResult,
  (results) => results.map((result) => result.id)
);

/**
 * Select snippetIds from item id of normalized listToPlay result items
 */
export const selectNormListToPlaySnippetIds = createSelector(
  selectNormListToPlayResult,
  selectAllNormPlaylistItems,
  selectAllNormVideoItems,
  (result, playlistItems, videoItems) => {
    return result.map(({ id: itemId, schema }) =>
      schema === "playlistItems"
        ? playlistItems[itemId].snippet
        : videoItems[itemId].snippet
    );
  }
);

/**
 * Select listToPlay result snippets. If the snippet is undefined, it is skipped
 */
export const selectNormListToPlayResultSnippets = createSelector(
  [
    selectNormListToPlayResult,
    selectNormPlaylistsEntities,
    selectNormVideosEntities,
  ],
  (result, playlistEntities, videoEntities) => {
    const snippets = [];

    for (const { id: itemId, schema } of result) {
      const listToPlaySnippet = getSnippetFromItemId(
        schema === "playlistItems"
          ? (playlistEntities as NormPlaylistsEntities)
          : (videoEntities as NormVideosEntities),
        itemId
      );

      // does not include undefined (invalid) snippet
      if (listToPlaySnippet) snippets.push(listToPlaySnippet);
    }

    return snippets;
  }
);

// =====================================
// =====================================
// Filtered
// =====================================
// =====================================
export const selectFilteredSnippets = createSelector(
  selectFilteredState,
  (filtered) => filtered.snippets
);

// =====================================
// =====================================
// General
// =====================================
// =====================================
/**
 * Select snippet from either playlist/video based on itemId
 * Return snippet that is defined, or undefined if
 * snippet could not be found on both playlist/video
 * states
 */
export const selectNormSnippetByItemId = createCachedSelector(
  selectNormPlaylistSnippetByItemId,
  selectNormVideoSnippetByItemId,
  (playlistSnippet, videoSnippet) => playlistSnippet || videoSnippet
)((_, itemId) => `snippet-itemId-${itemId}`);

/**
 * Select snippets from an array of itemIds.
 * Used to get filteredSnippets of filtered states.
 * Undefined snippets are skipped
 */
export const selectNormSnippetsByItemIds = createCachedSelector(
  selectNormPlaylistsEntities,
  selectNormVideosEntities,
  (_: AppState, itemIds: string[]) => itemIds,
  (playlistEntities, videoEntities, itemIds) => {
    const snippets: (PlaylistItemSnippet | VideoItemSnippet)[] = [];

    for (const itemId of itemIds) {
      const { playlistItems } = playlistEntities;

      const snippet = isPlaylistItemExists(playlistItems, itemId)
        ? getSnippetWithCombinedItemId(
            playlistEntities as NormPlaylistsEntities,
            itemId
          )
        : getSnippetWithCombinedItemId(
            videoEntities as NormVideosEntities,
            itemId
          );

      if (snippet) snippets.push(snippet);
    }

    return snippets;
  }
)((_, itemIds) => `snippets-itemIds-${itemIds.toString()}`);

export const selectNormSnippetIdByItemId = createCachedSelector(
  selectAllNormPlaylistItems,
  selectAllNormVideoItems,
  (_: AppState, itemId: string) => itemId,
  (playlistItems, videoItems, itemId) => {
    const playlistItem = playlistItems[itemId];
    const videoItem = videoItems[itemId];

    // return playlistItem's snippet id if the itemId belongs to playlist,
    // else return videoItem's snippet id
    return playlistItem
      ? get(playlistItem, "snippet")
      : get(videoItem, "snippet");
  }
)((_, itemId) => `snippetId-itemId-${itemId}`);
