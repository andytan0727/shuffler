import { createAction } from "typesafe-actions";
import {
  ADD_LIST_TO_PLAY,
  ADD_LIST_TO_PLAY_ITEM,
  ADD_LIST_TO_PLAY_ITEMS,
  ADD_UNIQUE_LIST_TO_PLAY,
  CHOOSE_FIRST_ITEM_AND_SHUFFLE_LIST_TO_PLAY,
  CLEAR_LIST_TO_PLAY,
  DELETE_LIST_TO_PLAY_ITEM_BY_ID,
  DELETE_LIST_TO_PLAY_ITEMS,
  FILTER_LIST_TO_PLAY_ITEMS,
  QUEUE_LIST_TO_PLAY_ITEM,
  SHUFFLE_LIST_TO_PLAY,
  UPDATE_LIST_TO_PLAY,
} from "utils/constants/actionConstants";

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
  ADD_LIST_TO_PLAY,
  (entities: ListToPlayEntities, result: ListToPlayResultItem[]) => ({
    entities,
    result,
  })
)();

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
  ADD_UNIQUE_LIST_TO_PLAY,
  (entities: ListToPlayEntities, result: ListToPlayResultItem[]) => ({
    entities,
    result,
  })
)();

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
  ADD_LIST_TO_PLAY_ITEM,
  (resultItem: ListToPlayResultItem, foreignKey: string) => ({
    resultItem,
    foreignKey,
  })
)();

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
  ADD_LIST_TO_PLAY_ITEMS,
  (
    items: {
      resultItem: ListToPlayResultItem;
      foreignKey: string;
    }[]
  ) => ({
    items,
  })
)();

/**
 * Update entire listToPlay with full replacement to previous state
 *
 * @param schema Schema type (playlistItems/videoItems)
 * @param foreignKey Id referring to the source (playlistId/videoId)
 * @param itemIds An array of itemIds
 * @returns UPDATE_LIST_TO_PLAY action object
 */
export const updateListToPlayAction = createAction(
  UPDATE_LIST_TO_PLAY,
  (schema: SchemaType, foreignKey: string, itemIds: string[]) => ({
    schema,
    foreignKey,
    itemIds,
  })
)();

/**
 * Delete per listToPlay item by itemId
 *
 * @param id Item id to be deleted
 * @returns DELETE_LIST_TO_PLAY_ITEM_BY_ID action object
 */
export const deleteListToPlayItemByIdAction = createAction(
  DELETE_LIST_TO_PLAY_ITEM_BY_ID,
  (id: string) => ({
    id,
  })
)();

/**
 * Delete listToPlay items by itemIds
 *
 * @param ids Item ids array to be deleted
 * @returns DELETE_LIST_TO_PLAY_ITEMS action object
 */
export const deleteListToPlayItemsAction = createAction(
  DELETE_LIST_TO_PLAY_ITEMS,
  (ids: string[]) => ({
    ids,
  })
)();

/**
 * Clear current playing playlist
 *
 * @returns CLEAR_LIST_TO_PLAY action object for redux store
 */
export const clearListToPlayAction = createAction(CLEAR_LIST_TO_PLAY)();

/**
 * Shuffle listToPlay
 *
 * @param itemIds Optional selected items to be fixed (position) when shuffling
 *
 * @returns SHUFFLE_LIST_TO_PLAY action object
 */
export const shuffleListToPlayAction = createAction(
  SHUFFLE_LIST_TO_PLAY,
  (itemIds?: string[]) => ({
    itemIds,
  })
)();

/**
 * Choose and fix first item, then shuffle the rest of the listToPlay result items
 *
 * @param itemId ItemId of item to be fixed as first item
 * @returns CHOOSE_FIRST_ITEM_AND_SHUFFLE_LIST_TO_PLAY action object
 */
export const chooseFirstItemAndShuffleListToPlayAction = createAction(
  CHOOSE_FIRST_ITEM_AND_SHUFFLE_LIST_TO_PLAY,
  (itemId: string) => ({
    itemId,
  })
)();

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
  FILTER_LIST_TO_PLAY_ITEMS,
  (itemIds: string[]) => ({
    itemIds,
  })
)();

/**
 * Queue the selected video after currently playing video in playing list
 *
 * @param curSongIdx Index of currently playing video
 * @param itemId Item id of the selected video
 * @returns QUEUE_LIST_TO_PLAY_ITEM action object
 */
export const queueListToPlayItemAction = createAction(
  QUEUE_LIST_TO_PLAY_ITEM,
  (curSongIdx: number, itemId: string) => ({
    curSongIdx,
    itemId,
  })
)();
