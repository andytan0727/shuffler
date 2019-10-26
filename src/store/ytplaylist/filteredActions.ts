import { createAction } from "typesafe-actions";
import {
  CLEAR_FILTERED_SNIPPETS,
  CREATE_FUSE,
  FUZZY_SEARCH_SNIPPETS_BY_TITLE,
  REMOVE_FILTERED_SNIPPETS_BY_ITEM_IDS,
} from "utils/constants/actionConstants";

import { ListToPlaySnippets } from "./types";

/**
 * Create fuse from fuse.js to be used as the fussy search item later
 *
 * @param snippets An array of Playlist/video snippet
 * @returns CREATE_FUSE action object
 */
export const createFuse = createAction(CREATE_FUSE, (action) => {
  return (snippets: ListToPlaySnippets) =>
    action({
      snippets,
    });
});

/**
 * Fuzzy search snippets from created fuse
 *
 * @param title Snippet title to search for
 *
 */
export const fuzzySearchSnippetsByTitle = createAction(
  FUZZY_SEARCH_SNIPPETS_BY_TITLE,
  (action) => {
    return (title: string) =>
      action({
        title,
      });
  }
);

/**
 * Clear filtered snippets and set it to undefined
 *
 * @returns CLEAR_FILTERED_SNIPPETS action object
 */
export const clearFilteredSnippets = createAction(CLEAR_FILTERED_SNIPPETS);

/**
 * Remove filtered snippets by itemIds (when deleting items from original list)
 *
 * @param itemIds An array of filtered snippets itemIds
 * @returns REMOVE_FILTERED_SNIPPETS_BY_ITEM_IDS action object
 */
export const removeFilteredSnippetsByItemIds = createAction(
  REMOVE_FILTERED_SNIPPETS_BY_ITEM_IDS,
  (action) => {
    return (itemIds: string[]) =>
      action({
        itemIds,
      });
  }
);
