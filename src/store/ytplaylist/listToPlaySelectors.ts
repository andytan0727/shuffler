import createCachedSelector from "re-reselect";
import { createSelector } from "reselect";
import { AppState } from "store";

import {
  selectAllNormPlaylistItems,
  selectNormPlaylistsEntities,
} from "./playlistSelectors";
import { NormPlaylistsEntities, NormVideosEntities } from "./types";
import { getSnippetFromItemId } from "./utils";
import {
  selectAllNormVideoItems,
  selectNormVideosEntities,
} from "./videoSelectors";

export const selectNormListToPlayEntities = (state: AppState) =>
  state.ytplaylistNormed.listToPlay.entities;
export const selectNormListToPlayResult = (state: AppState) =>
  state.ytplaylistNormed.listToPlay.result;

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

export const selectNormListToPlayTotalItems = createSelector(
  selectNormListToPlayResult,
  (result) => result.length
);
