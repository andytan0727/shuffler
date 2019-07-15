import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";
import map from "lodash/map";
import pick from "lodash/pick";
import { AppState } from "store";

const normPlaylistsEntitiesSelector = (state: AppState) =>
  state.ytplaylistNormed.playlists.entities;
const normVideosEntitiesSelector = (state: AppState) =>
  state.ytplaylistNormed.videos.entities;

export const allNormPlaylistItems = createSelector(
  normPlaylistsEntitiesSelector,
  (entities) => entities.playlistItems
);

export const allNormPlaylistSnippets = createSelector(
  normPlaylistsEntitiesSelector,
  (entities) => entities.snippets
);

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

export const normPlaylistItemSnippetSelector = createCachedSelector(
  normPlaylistsEntitiesSelector,
  (_: never, playlistItemId: string) => playlistItemId,
  (entities, itemId) => {
    const snippetId = entities.playlistItems[itemId].snippet;

    return entities.snippets[snippetId];
  }
)((_, itemId) => `playlistItem-${itemId}`);

export const normPlaylistItemSnippetsSelector = createCachedSelector(
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

export const allNormVideoSnippets = createSelector(
  normVideosEntitiesSelector,
  (entities) => entities.snippets
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

export const normVideoItemSnippetsSelector = createSelector(
  allNormVideoSnippets,
  (snippets) => map(snippets, (val, key) => ({ id: key, ...val }))
);
