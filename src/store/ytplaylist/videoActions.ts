import { createAction } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { VideosEntities } from "./types";

/**
 * Add fetched video data from API to redux store
 *
 * @param entities Normalized videos entities from videos states
 * @param result Normalized videos result from videos states
 * @returns ADD_FETCHED_VIDEO action object
 */
export const addVideoAction = createAction(ActionTypes.ADD_VIDEO, (action) => {
  return (entities: VideosEntities, result: string[]) =>
    action({
      entities,
      result,
    });
});

/**
 * Add all items in the specified playlist into listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param videoId Video id (Can be item/snippet id as well)
 * @returns ADD_VIDEO_TO_LIST_TO_PLAY action object
 */
export const addVideoToListToPlayAction = createAction(
  ActionTypes.ADD_VIDEO_TO_LIST_TO_PLAY,
  (action) => {
    return (videoId: string) =>
      action({
        videoId,
      });
  }
);

/**
 * Batch addition of videos to listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param videoIds An array of Video id (Can be item/snippet id as well)
 * @returns ADD_VIDEOS_TO_LIST_TO_PLAY action object
 */
export const addVideosToListToPlayAction = createAction(
  ActionTypes.ADD_VIDEOS_TO_LIST_TO_PLAY,
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
export const updateVideoNameByIdAction = createAction(
  ActionTypes.UPDATE_VIDEO_NAME_BY_ID,
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
export const deleteVideoByIdAction = createAction(
  ActionTypes.DELETE_VIDEO_BY_ID,
  (action) => {
    return (id: string) =>
      action({
        id,
      });
  }
);

/**
 * Remove video item from listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param videoId Video id to remove (can be item/snippet id as well)
 *
 */
export const removeVideoFromListToPlayAction = createAction(
  ActionTypes.REMOVE_VIDEO_FROM_LIST_TO_PLAY,
  (action) => {
    return (videoId: string) =>
      action({
        videoId,
      });
  }
);

/**
 * Batch remove video items from listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param videoIds An array of video id to remove (can be item/snippet id as well)
 *
 */
export const removeVideosFromListToPlayAction = createAction(
  ActionTypes.REMOVE_VIDEOS_FROM_LIST_TO_PLAY,
  (action) => {
    return (videoIds: string[]) =>
      action({
        videoIds,
      });
  }
);
