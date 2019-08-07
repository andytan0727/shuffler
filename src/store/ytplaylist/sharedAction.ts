import { createAction } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

/**
 * Clear current playing playlist
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
