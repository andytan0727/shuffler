import { createAction } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { NormListToPlayEntities, NormListToPlayResultItem } from "./types";

/**
 * Add normalized listToPlay entities to store
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param entities Normalized entities of listToPlay
 * @param result Normalized result of listToPlay
 * @returns ADD_NORM_LIST_TO_PLAY action object
 */
export const addNormListToPlayAction = createAction(
  ActionTypes.ADD_NORM_LIST_TO_PLAY,
  (action) => {
    return (
      entities: NormListToPlayEntities,
      result: NormListToPlayResultItem[]
    ) =>
      action({
        entities,
        result,
      });
  }
);

/**
 * Add listToPlay entities and result unique
 * with snippetId associating with itemId of result
 * item to normalized listToPlay
 *
 * @param entities Normalized entities of listToPlay
 * @param result Normalized result of listToPlay
 * @returns ADD_UNIQUE_NORM_LIST_TO_PLAY action object
 */
export const addUniqueNormListToPlay = createAction(
  ActionTypes.ADD_UNIQUE_NORM_LIST_TO_PLAY,
  (action) => {
    return (
      entities: NormListToPlayEntities,
      result: NormListToPlayResultItem[]
    ) =>
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
export const addNormListToPlayItemAction = createAction(
  ActionTypes.ADD_NORM_LIST_TO_PLAY_ITEM,
  (action) => {
    return (resultItem: NormListToPlayResultItem, foreignKey: string) =>
      action({
        resultItem,
        foreignKey,
      });
  }
);

/**
 * Add items as a batch to normalized listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param items Item array consists of normalized listToPlay's result item and
 * foreign key
 * @returns ADD_NORM_LIST_TO_PLAY_ITEMS action object
 *
 */
export const addNormListToPlayItemsAction = createAction(
  ActionTypes.ADD_NORM_LIST_TO_PLAY_ITEMS,
  (action) => {
    return (
      items: {
        resultItem: NormListToPlayResultItem;
        foreignKey: string;
      }[]
    ) =>
      action({
        items,
      });
  }
);

/**
 * Update entire normalized listToPlay with full replacement to previous state
 *
 * @param schema Schema type (playlistItems/videoItems)
 * @param foreignKey Id referring to the source (playlistId/videoId)
 * @param itemIds An array of itemIds
 * @returns UPDATE_NORM_LIST_TO_PLAY action object
 */
export const updateNormListToPlayAction = createAction(
  ActionTypes.UPDATE_NORM_LIST_TO_PLAY,
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
export const deleteNormListToPlayItemByIdAction = createAction(
  ActionTypes.DELETE_NORM_LIST_TO_PLAY_ITEM_BY_ID,
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
export const deleteNormListToPlayItemsAction = createAction(
  ActionTypes.DELETE_NORM_LIST_TO_PLAY_ITEMS,
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
 * @returns SHUFFLE_LIST_TO_PLAY action object
 */
export const shuffleListToPlayAction = createAction(
  ActionTypes.SHUFFLE_LIST_TO_PLAY
);
