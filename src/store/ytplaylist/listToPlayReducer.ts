import produce, { Draft } from "immer";
import remove from "lodash/remove";
import shuffle from "lodash/shuffle";
import zip from "lodash/zip";
import { Reducer } from "typesafe-actions";
import {
  ADD_UNIQUE_LIST_TO_PLAY,
  CHOOSE_FIRST_ITEM_AND_SHUFFLE_LIST_TO_PLAY,
  CLEAR_LIST_TO_PLAY,
  DELETE_LIST_TO_PLAY_ITEM_BY_ID,
  DELETE_LIST_TO_PLAY_ITEMS,
  QUEUE_LIST_TO_PLAY_ITEM,
  REORDER_LIST_TO_PLAY_ITEM,
  SHUFFLE_LIST_TO_PLAY,
  UPDATE_LIST_TO_PLAY,
} from "utils/constants/actionConstants";
import { moveMutable } from "utils/helper/arrayHelper";

import { DeepReadonlyListToPlay, ListToPlay, YTPlaylistActions } from "./types";
import {
  deepMergeStates,
  deleteListToPlayItemById,
  removeResultItem,
} from "./utils";

const initialListToPlayState: DeepReadonlyListToPlay = {
  entities: {
    playlistItems: {},
    videoItems: {},
  },
  result: [],
};

export const listToPlayReducer: Reducer<
  DeepReadonlyListToPlay,
  YTPlaylistActions
> = produce((draft: Draft<ListToPlay>, action: YTPlaylistActions) => {
  switch (action.type) {
    // for batch addition of items directly
    // through normalized listToPlay
    // entities and result
    case ADD_UNIQUE_LIST_TO_PLAY: {
      const { entities, result } = action.payload;
      return deepMergeStates(draft, entities, result);
    }

    // Update entire listToPlay without preserving previous details
    // mainly used for play (ONE) and only one playlist
    // without mixing other videos/playlists
    // assume all snippets in (ONE) playlist taken from API are all unique
    // No need to check for uniqueness of snippets in (ONE) playlist
    case UPDATE_LIST_TO_PLAY: {
      const { schema, foreignKey, itemIds } = action.payload;

      // clear previous state
      draft.entities.playlistItems = {};
      draft.entities.videoItems = {};
      draft.result = [];

      // update cleared states with new states
      itemIds.forEach((itemId) => {
        draft.entities[schema][itemId] = { id: itemId, foreignKey };
        draft.result.push({
          id: itemId,
          schema,
        });
      });

      return draft;
    }

    case DELETE_LIST_TO_PLAY_ITEM_BY_ID: {
      return deleteListToPlayItemById(draft, action.payload.id);
    }

    case DELETE_LIST_TO_PLAY_ITEMS: {
      const { ids } = action.payload;

      ids.forEach((id) => {
        deleteListToPlayItemById(draft, id);
      });

      return draft;
    }

    case CLEAR_LIST_TO_PLAY: {
      draft.entities.playlistItems = {};
      draft.entities.videoItems = {};
      draft.result = [];

      return draft;
    }

    // if itemIds array is provided, this action will
    // shuffle listToPlay with fixed position items,
    // The fixed position items' id are specified by
    // itemIds array
    // If no itemIds array provided, this action will
    // go through normal shuffling process
    case SHUFFLE_LIST_TO_PLAY: {
      const { itemIds } = action.payload;
      const removedItemIndexes: number[] = [];

      // proceed to normal shuffle if no itemIds provided
      if (!itemIds) {
        draft.result = shuffle(draft.result);
        return draft;
      }

      // get all removed fixed items from result array
      const removedItems = remove(draft.result, (item, idx) => {
        const isItemToRemove = itemIds.includes(item.id);

        // store removed items indexes for re-adding
        if (isItemToRemove) {
          removedItemIndexes.push(idx);
        }

        return isItemToRemove;
      });

      // shuffle listToPlay result array without fixed items
      draft.result = shuffle(draft.result);

      // re-add fixed items after shuffling
      for (const [itemIdx, item] of zip(removedItemIndexes, removedItems)) {
        if (itemIdx !== undefined && item !== undefined) {
          draft.result.splice(itemIdx, 0, item);
        }
      }

      return draft;
    }

    case CHOOSE_FIRST_ITEM_AND_SHUFFLE_LIST_TO_PLAY: {
      const { itemId } = action.payload;

      const removedItem = removeResultItem(draft.result, itemId);

      // shuffle then insert removed item as first item
      // this creates the effect of fixed first item then shuffle
      draft.result = shuffle(draft.result);
      draft.result.splice(0, 0, removedItem);

      return draft;
    }

    case QUEUE_LIST_TO_PLAY_ITEM: {
      const { curSongIdx, itemId } = action.payload;

      const removedItem = removeResultItem(draft.result, itemId);

      draft.result.splice(curSongIdx + 1, 0, removedItem);
      return draft;
    }

    case REORDER_LIST_TO_PLAY_ITEM: {
      const { fromIdx, toIdx } = action.payload;

      moveMutable(draft.result, fromIdx, toIdx);

      return draft;
    }

    default:
      return draft;
  }
}, initialListToPlayState);
