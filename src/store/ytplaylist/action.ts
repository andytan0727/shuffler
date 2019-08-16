import { createAction } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { PlaylistItem, VideoItem } from "./types";

// ===============================================
// listToPlay
// ===============================================
/**
 * @deprecated Remove as of next stable version (v4.0)*
 *
 * @param items Items obtained from API (items key in json returned)
 * @returns APPEND_LIST_TO_PLAY action object
 */
export const appendListToPlayAction = createAction(
  ActionTypes.APPEND_LIST_TO_PLAY,
  (action) => {
    return (items: (PlaylistItem | VideoItem)[]) =>
      action({
        items,
      });
  }
);

/**
 * Remove item(s) containing itemIds from listToPlay
 *
 * @deprecated Remove as of next stable version (v4.0)*
 *
 * @param itemIds Playlist/Video' ids
 * @param itemType  Type of item to remove (playlist/video)
 * @returns REMOVE_FROM_LIST_TO_PLAY action object
 */
export const removeFromListToPlayAction = createAction(
  ActionTypes.REMOVE_FROM_LIST_TO_PLAY,
  (action) => {
    return (itemIds: string[], itemType: MediaSourceType) =>
      action({
        itemIds,
        itemType,
      });
  }
);
