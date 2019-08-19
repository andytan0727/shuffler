import createCachedSelector from "re-reselect";
import { createSelector } from "reselect";
import { AppState } from "store";

import {
  selectAllPlaylistItems,
  selectPlaylistsEntities,
} from "./playlistSelectors";
import { PlaylistsEntities, VideosEntities } from "./types";
import { getSnippetFromItemId } from "./utils";
import { selectAllVideoItems, selectVideosEntities } from "./videoSelectors";

export const selectListToPlayEntities = (state: AppState) =>
  state.ytplaylist.listToPlay.entities;
export const selectListToPlayResult = (state: AppState) =>
  state.ytplaylist.listToPlay.result;

export const selectListToPlayPlaylistItems = createSelector(
  selectListToPlayEntities,
  (entities) => entities.playlistItems
);

export const selectListToPlayPlaylistItemByItemId = createCachedSelector(
  selectListToPlayPlaylistItems,
  (_: AppState, itemId: string) => itemId,
  (playlistItems, itemId) => playlistItems[itemId]
)((_, id) => `LTP-PI-${id}`);

export const selectListToPlayVideoItems = createSelector(
  selectListToPlayEntities,
  (entities) => entities.videoItems
);

export const selectListToPlayVideoItemByItemId = createCachedSelector(
  selectListToPlayVideoItems,
  (_: AppState, itemId: string) => itemId,
  (videoItems, itemId) => videoItems[itemId]
)((_, id) => `LTP-VI-${id}`);

export const selectAllListToPlayItemIds = createSelector(
  selectListToPlayResult,
  (results) => results.map((result) => result.id)
);

/**
 * Select snippetIds from item id of listToPlay result items
 */
export const selectListToPlaySnippetIds = createSelector(
  selectListToPlayResult,
  selectAllPlaylistItems,
  selectAllVideoItems,
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
export const selectListToPlayResultSnippets = createSelector(
  [selectListToPlayResult, selectPlaylistsEntities, selectVideosEntities],
  (result, playlistEntities, videoEntities) => {
    const snippets = [];

    for (const { id: itemId, schema } of result) {
      const listToPlaySnippet = getSnippetFromItemId(
        schema === "playlistItems"
          ? (playlistEntities as PlaylistsEntities)
          : (videoEntities as VideosEntities),
        itemId
      );

      // does not include undefined (invalid) snippet
      if (listToPlaySnippet) snippets.push(listToPlaySnippet);
    }

    return snippets;
  }
);

export const selectListToPlayTotalItems = createSelector(
  selectListToPlayResult,
  (result) => result.length
);
