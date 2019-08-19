import { createAction } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { ListToPlayEntities, ListToPlayResultItem } from "./types";

/**
 * Add normalized listToPlay entities to store
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param entities Normalized entities of listToPlay
 * @param result Normalized result of listToPlay
 * @returns ADD_LIST_TO_PLAY action object
 */
export const addListToPlayAction = createAction(
  ActionTypes.ADD_LIST_TO_PLAY,
  (action) => {
    return (entities: ListToPlayEntities, result: ListToPlayResultItem[]) =>
      action({
        entities,
        result,
      });
  }
);

/**
 * Add listToPlay entities and result unique
 * with snippetId associating with itemId of result
 * item to listToPlay
 *
 * @param entities Normalized entities of listToPlay
 * @param result Normalized result of listToPlay
 * @returns ADD_UNIQUE_LIST_TO_PLAY action object
 */
export const addUniqueListToPlay = createAction(
  ActionTypes.ADD_UNIQUE_LIST_TO_PLAY,
  (action) => {
    return (entities: ListToPlayEntities, result: ListToPlayResultItem[]) =>
      action({
        entities,
        result,
      });
  }
);

/**
 * Add per item to listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param resultItem List item with item's id and its schema
 * @param foreignKey Id of playlist/video that owns this item
 * @returns ADD_LIST_TO_PLAY_ITEM action object
 */
export const addListToPlayItemAction = createAction(
  ActionTypes.ADD_LIST_TO_PLAY_ITEM,
  (action) => {
    return (resultItem: ListToPlayResultItem, foreignKey: string) =>
      action({
        resultItem,
        foreignKey,
      });
  }
);

/**
 * Add items as a batch to listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param items Item array consists of listToPlay's result item and
 * foreign key
 * @returns ADD_LIST_TO_PLAY_ITEMS action object
 *
 */
export const addListToPlayItemsAction = createAction(
  ActionTypes.ADD_LIST_TO_PLAY_ITEMS,
  (action) => {
    return (
      items: {
        resultItem: ListToPlayResultItem;
        foreignKey: string;
      }[]
    ) =>
      action({
        items,
      });
  }
);

/**
 * Update entire listToPlay with full replacement to previous state
 *
 * @param schema Schema type (playlistItems/videoItems)
 * @param foreignKey Id referring to the source (playlistId/videoId)
 * @param itemIds An array of itemIds
 * @returns UPDATE_LIST_TO_PLAY action object
 */
export const updateListToPlayAction = createAction(
  ActionTypes.UPDATE_LIST_TO_PLAY,
  (action) => {
    return (schema: SchemaType, foreignKey: string, itemIds: string[]) =>
      action({
        schema,
        foreignKey,
        itemIds,
      });
  }
);

/**
 * Delete per listToPlay item by itemId
 *
 * @param id Item id to be deleted
 * @returns DELETE_LIST_TO_PLAY_ITEM_BY_ID action object
 */
export const deleteListToPlayItemByIdAction = createAction(
  ActionTypes.DELETE_LIST_TO_PLAY_ITEM_BY_ID,
  (action) => {
    return (id: string) =>
      action({
        id,
      });
  }
);

/**
 * Delete listToPlay items by itemIds
 *
 * @param ids Item ids array to be deleted
 * @returns DELETE_LIST_TO_PLAY_ITEMS action object
 */
export const deleteListToPlayItemsAction = createAction(
  ActionTypes.DELETE_LIST_TO_PLAY_ITEMS,
  (action) => {
    return (ids: string[]) =>
      action({
        ids,
      });
  }
);

/**
 * Clear current playing playlist
 *
 * @returns CLEAR_LIST_TO_PLAY action object for redux store
 */
export const clearListToPlayAction = createAction(
  ActionTypes.CLEAR_LIST_TO_PLAY
);

/**
 * Shuffle listToPlay
 *
 * @param itemIds Optional selected items to be fixed (position) when shuffling
 *
 * @returns SHUFFLE_LIST_TO_PLAY action object
 */
export const shuffleListToPlayAction = createAction(
  ActionTypes.SHUFFLE_LIST_TO_PLAY,
  (action) => {
    return (itemIds?: string[]) =>
      action({
        itemIds,
      });
  }
);

/**
 * Choose and fix first item, then shuffle the rest of the listToPlay result items
 *
 * @param itemId ItemId of item to be fixed as first item
 * @returns CHOOSE_FIRST_ITEM_AND_SHUFFLE_LIST_TO_PLAY action object
 */
export const chooseFirstItemAndShuffleListToPlayAction = createAction(
  ActionTypes.CHOOSE_FIRST_ITEM_AND_SHUFFLE_LIST_TO_PLAY,
  (action) => {
    return (itemId: string) =>
      action({
        itemId,
      });
  }
);

/**
 * Filter out listToPlay items specified by itemId in itemIds array.
 * Then all the other listToPlay items are removed,
 * replaced with filtered items
 *
 * Unlike the almost identical **updateListToPlayAction**,
 * this action filters only items that **existed previously**
 * in listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param itemIds Item id array of items to be filtered
 * @returns FILTER_LIST_TO_PLAY_ITEMS action object
 */
export const filterListToPlayItemsAction = createAction(
  ActionTypes.FILTER_LIST_TO_PLAY_ITEMS,
  (action) => {
    return (itemIds: string[]) =>
      action({
        itemIds,
      });
  }
);
