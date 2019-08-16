import get from "lodash/get";
import createCachedSelector from "re-reselect";
import { AppState } from "store";

import {
  selectAllNormPlaylistItems,
  selectNormPlaylistsEntities,
  selectNormPlaylistSnippetByItemId,
} from "./playlistSelectors";
import {
  NormPlaylistsEntities,
  NormVideosEntities,
  PlaylistItemSnippet,
  VideoItemSnippet,
} from "./types";
import { getSnippetWithCombinedItemId, isPlaylistItemExists } from "./utils";
import {
  selectAllNormVideoItems,
  selectNormVideosEntities,
  selectNormVideoSnippetByItemId,
} from "./videoSelectors";

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
