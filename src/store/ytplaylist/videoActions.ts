import { createAction } from "typesafe-actions";
import {
  ADD_VIDEO,
  ADD_VIDEO_TO_LIST_TO_PLAY,
  ADD_VIDEOS_TO_LIST_TO_PLAY,
  DELETE_VIDEO_BY_ID,
  REMOVE_VIDEO_FROM_LIST_TO_PLAY,
  REMOVE_VIDEOS_FROM_LIST_TO_PLAY,
  REORDER_VIDEO_ITEM,
  UPDATE_VIDEO_NAME_BY_ID,
} from "utils/constants/actionConstants";

import { VideosEntities } from "./types";

/**
 * Add fetched video data from API to redux store
 *
 * @param entities Normalized videos entities from videos states
 * @param result Normalized videos result from videos states
 * @returns ADD_FETCHED_VIDEO action object
 */
export const addVideoAction = createAction(
  ADD_VIDEO,
  (entities: VideosEntities, result: string[]) => ({
    entities,
    result,
  })
)();

/**
 * Add all items in the specified playlist into listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param videoId Video id (Can be item/snippet id as well)
 * @returns ADD_VIDEO_TO_LIST_TO_PLAY action object
 */
export const addVideoToListToPlayAction = createAction(
  ADD_VIDEO_TO_LIST_TO_PLAY,
  (videoId: string) => ({
    videoId,
  })
)();

/**
 * Batch addition of videos to listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param videoIds An array of Video id (Can be item/snippet id as well)
 * @returns ADD_VIDEOS_TO_LIST_TO_PLAY action object
 */
export const addVideosToListToPlayAction = createAction(
  ADD_VIDEOS_TO_LIST_TO_PLAY,
  (videoIds: string[]) => ({
    videoIds,
  })
)();

/**
 * Update video name by id
 *
 * @param id Video id to rename
 * @param name New name for the specified video
 * @returns UPDATE_VIDEO_NAME_BY_ID action object
 */
export const updateVideoNameByIdAction = createAction(
  UPDATE_VIDEO_NAME_BY_ID,
  (id: string, name: string) => ({
    id,
    name,
  })
)();

/**
 * Delete per video from store by id
 *
 * @param id Video id to delete
 * @returns DELETE_VIDEO_BY_ID action object
 */
export const deleteVideoByIdAction = createAction(
  DELETE_VIDEO_BY_ID,
  (id: string) => ({
    id,
  })
)();

/**
 * Remove video item from listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param videoId Video id to remove (can be item/snippet id as well)
 *
 */
export const removeVideoFromListToPlayAction = createAction(
  REMOVE_VIDEO_FROM_LIST_TO_PLAY,
  (videoId: string) => ({
    videoId,
  })
)();

/**
 * Batch remove video items from listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param videoIds An array of video id to remove (can be item/snippet id as well)
 *
 */
export const removeVideosFromListToPlayAction = createAction(
  REMOVE_VIDEOS_FROM_LIST_TO_PLAY,
  (videoIds: string[]) => ({
    videoIds,
  })
)();

/**
 * Reorder the position of video item, from fromIdx to toIdx
 *
 * @param fromIdx Source index
 * @param toIdx Destination index
 * @returns REORDER_VIDEO_ITEM action object
 *
 */
export const reorderVideoItem = createAction(
  REORDER_VIDEO_ITEM,
  (fromIdx: number, toIdx: number) => ({
    fromIdx,
    toIdx,
  })
)();
