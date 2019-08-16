import map from "lodash/map";
import createCachedSelector from "re-reselect";
import { createSelector } from "reselect";
import { AppState } from "store";

import { NormVideosEntities } from "./types";
import { getSnippetFromItemId } from "./utils";

export const selectNormVideosEntities = (state: AppState) =>
  state.ytplaylistNormed.videos.entities;

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
