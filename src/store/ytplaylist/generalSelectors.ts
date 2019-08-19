import get from "lodash/get";
import createCachedSelector from "re-reselect";
import { AppState } from "store";

import {
  selectAllPlaylistItems,
  selectPlaylistsEntities,
  selectPlaylistSnippetByItemId,
} from "./playlistSelectors";
import {
  PlaylistItemSnippet,
  PlaylistsEntities,
  VideoItemSnippet,
  VideosEntities,
} from "./types";
import { getSnippetWithCombinedItemId, isPlaylistItemExists } from "./utils";
import {
  selectAllVideoItems,
  selectVideosEntities,
  selectVideoSnippetByItemId,
} from "./videoSelectors";

/**
 * Select snippet from either playlist/video based on itemId
 * Return snippet that is defined, or undefined if
 * snippet could not be found on both playlist/video
 * states
 */
export const selectSnippetByItemId = createCachedSelector(
  selectPlaylistSnippetByItemId,
  selectVideoSnippetByItemId,
  (playlistSnippet, videoSnippet) => playlistSnippet || videoSnippet
)((_, itemId) => `snippet-itemId-${itemId}`);

/**
 * Select snippets from an array of itemIds.
 * Used to get filteredSnippets of filtered states.
 * Undefined snippets are skipped
 */
export const selectSnippetsByItemIds = createCachedSelector(
  selectPlaylistsEntities,
  selectVideosEntities,
  (_: AppState, itemIds: string[]) => itemIds,
  (playlistEntities, videoEntities, itemIds) => {
    const snippets: (PlaylistItemSnippet | VideoItemSnippet)[] = [];

    for (const itemId of itemIds) {
      const { playlistItems } = playlistEntities;

      const snippet = isPlaylistItemExists(playlistItems, itemId)
        ? getSnippetWithCombinedItemId(
            playlistEntities as PlaylistsEntities,
            itemId
          )
        : getSnippetWithCombinedItemId(videoEntities as VideosEntities, itemId);

      if (snippet) snippets.push(snippet);
    }

    return snippets;
  }
)((_, itemIds) => `snippets-itemIds-${itemIds.toString()}`);

export const selectSnippetIdByItemId = createCachedSelector(
  selectAllPlaylistItems,
  selectAllVideoItems,
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
