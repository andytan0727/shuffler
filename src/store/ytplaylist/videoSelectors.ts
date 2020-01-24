import createCachedSelector from "re-reselect";
import { createSelector } from "reselect";
import { AppState } from "store";

import { VideosEntities } from "./types";
import { getSnippetFromItemId } from "./utils";

export const selectVideosEntities = (state: AppState) =>
  state.ytplaylist.videos.entities;

export const selectVideosResult = (state: AppState) =>
  state.ytplaylist.videos.result;

export const selectAllVideoSnippets = createSelector(
  selectVideosEntities,
  (entities) => entities.snippets
);

export const selectAllVideoItems = createSelector(
  selectVideosEntities,
  (entities) => entities.videoItems
);

// using result array as the video itemIds for an easier
// operation on reordering videos
export const selectAllVideoItemIds = selectVideosResult;

export const selectVideoItemCount = createSelector(
  selectAllVideoItemIds,
  (itemIds) => itemIds.length
);

export const selectVideoItemIdsByVideoId = createCachedSelector(
  selectVideosEntities,
  (_: AppState, videoId: string) => videoId,
  (entities, videoId) => entities.videos[videoId].items
)((_, id) => `itemIds-videoId-${id}`);

export const selectVideoSnippetByItemId = createCachedSelector(
  selectVideosEntities,
  (_: AppState, itemId: string) => itemId,
  (entities, itemId) => getSnippetFromItemId(entities as VideosEntities, itemId)
)((_, itemId) => `snippet-itemId-${itemId}`);

export const selectVideoSnippetsByItemIds = createCachedSelector(
  selectVideosEntities,
  (_: AppState, itemIds: string[]) => itemIds,
  (entities, itemIds) => {
    const snippetIds = itemIds.map(
      (itemId) => entities.videoItems[itemId].snippet
    );

    return snippetIds.map((snippetId) => entities.snippets[snippetId]);
  }
)((_, id) => `snippets-itemId-${id.toString()}`);

export const selectVideoIdByItemId = createCachedSelector(
  selectVideosEntities,
  (_: AppState, itemId: string) => itemId,
  (entities, itemId) => entities.videoItems[itemId].id
)((_, itemId) => `videoId-itemId-${itemId}`);
