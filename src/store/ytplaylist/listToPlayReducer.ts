import produce, { Draft } from "immer";
import remove from "lodash/remove";
import shuffle from "lodash/shuffle";
import zip from "lodash/zip";
import { Reducer } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { DeepReadonlyListToPlay, ListToPlay, YTPlaylistActions } from "./types";
import { deleteListToPlayItemById, mergeEntities } from "./utils";

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
    case ActionTypes.ADD_UNIQUE_LIST_TO_PLAY: {
      return mergeEntities(draft, action);
    }

    // Update entire listToPlay without preserving previous details
    // mainly used for play (ONE) and only one playlist
    // without mixing other videos/playlists
    // assume all snippets in (ONE) playlist taken from API are all unique
    // No need to check for uniqueness of snippets in (ONE) playlist
    case ActionTypes.UPDATE_LIST_TO_PLAY: {
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

    case ActionTypes.DELETE_LIST_TO_PLAY_ITEM_BY_ID: {
      return deleteListToPlayItemById(draft, action.payload.id);
    }

    case ActionTypes.DELETE_LIST_TO_PLAY_ITEMS: {
      const { ids } = action.payload;

      ids.forEach((id) => {
        deleteListToPlayItemById(draft, id);
      });

      return draft;
    }

    case ActionTypes.CLEAR_LIST_TO_PLAY: {
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
    case ActionTypes.SHUFFLE_LIST_TO_PLAY: {
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

    case ActionTypes.CHOOSE_FIRST_ITEM_AND_SHUFFLE_LIST_TO_PLAY: {
      const { itemId } = action.payload;

      const [removedItem] = remove(draft.result, (item) => item.id === itemId);

      if (!removedItem) throw new Error("Item not found in listToPlay");

      // shuffle then insert removed item as first item
      // this creates the effect of fixed first item then shuffle
      draft.result = shuffle(draft.result);
      draft.result.splice(0, 0, removedItem);

      return draft;
    }

    default:
      return draft;
  }
}, initialListToPlayState);
