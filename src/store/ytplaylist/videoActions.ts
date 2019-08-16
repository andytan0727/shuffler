import { createAction } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { NormVideosEntities } from "./types";

/**
 * Add fetched video data from API to redux store
 *
 * @param entities Normalized videos entities from videos states
 * @param result Normalized videos result from videos states
 * @returns ADD_FETCHED_VIDEO action object
 */
export const addNormVideoAction = createAction(
  ActionTypes.ADD_NORM_VIDEO,
  (action) => {
    return (entities: NormVideosEntities, result: string[]) =>
      action({
        entities,
        result,
      });
  }
);

/**
 * Add all items in the specified normalized playlist into normalized listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param videoId Video id (Can be item/snippet id as well)
 * @returns ADD_NORM_VIDEO_TO_NORM_LIST_TO_PLAY action object
 */
export const addNormVideoToNormListToPlayAction = createAction(
  ActionTypes.ADD_NORM_VIDEO_TO_NORM_LIST_TO_PLAY,
  (action) => {
    return (videoId: string) =>
      action({
        videoId,
      });
  }
);

/**
 * Batch addition of normalized videos to normalized listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param videoIds An array of Video id (Can be item/snippet id as well)
 * @returns ADD_NORM_VIDEOS_TO_NORM_LIST_TO_PLAY action object
 */
export const addNormVideosToNormListToPlayAction = createAction(
  ActionTypes.ADD_NORM_VIDEOS_TO_NORM_LIST_TO_PLAY,
  (action) => {
    return (videoIds: string[]) =>
      action({
        videoIds,
      });
  }
);

/**
 * Update video name by id
 *
 * @param id Video id to rename
 * @param name New name for the specified video
 * @returns UPDATE_VIDEO_NAME_BY_ID action object
 */
export const updateNormVideoNameByIdAction = createAction(
  ActionTypes.UPDATE_NORM_VIDEO_NAME_BY_ID,
  (action) => {
    return (id: string, name: string) =>
      action({
        id,
        name,
      });
  }
);

/**
 * Delete per video from store by id
 *
 * @param id Video id to delete
 * @returns DELETE_VIDEO_BY_ID action object
 */
export const deleteNormVideoByIdAction = createAction(
  ActionTypes.DELETE_NORM_VIDEO_BY_ID,
  (action) => {
    return (id: string) =>
      action({
        id,
      });
  }
);

/**
 * Remove video item from normalized listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param videoId Video id to remove (can be item/snippet id as well)
 *
 */
export const removeNormVideoFromNormListToPlayAction = createAction(
  ActionTypes.REMOVE_NORM_VIDEO_FROM_NORM_LIST_TO_PLAY,
  (action) => {
    return (videoId: string) =>
      action({
        videoId,
      });
  }
);

/**
 * Batch remove video items from normalized listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param videoIds An array of video id to remove (can be item/snippet id as well)
 *
 */
export const removeNormVideosFromNormListToPlayAction = createAction(
  ActionTypes.REMOVE_NORM_VIDEOS_FROM_NORM_LIST_TO_PLAY,
  (action) => {
    return (videoIds: string[]) =>
      action({
        videoIds,
      });
  }
);
