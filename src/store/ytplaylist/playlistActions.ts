import { createAction } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { NormPlaylistsEntities } from "./types";

/**
 * Add normalized fetched playlist data to redux store
 *
 * @param entities Normalized states entities of playlists
 * @param result Normalized states result of playlists
 * @returns ADD_FETCHED_PLAYLIST action object
 */
export const addNormPlaylistAction = createAction(
  ActionTypes.ADD_NORM_PLAYLIST,
  (action) => {
    return (entities: NormPlaylistsEntities, result: string[]) =>
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
 * @param playlistId Playlist id
 * @returns ADD_NORM_PLAYLIST_TO_NORM_LIST_TO_PLAY action object
 */
export const addNormPlaylistToNormListToPlayAction = createAction(
  ActionTypes.ADD_NORM_PLAYLIST_TO_NORM_LIST_TO_PLAY,
  (action) => {
    return (playlistId: string) =>
      action({
        playlistId,
      });
  }
);

/**
 * Remove all items in the specified normalized playlist from normalized listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param playlistId Playlist id
 *
 */
export const removeNormPlaylistFromNormListToPlayAction = createAction(
  ActionTypes.REMOVE_NORM_PLAYLIST_FROM_NORM_LIST_TO_PLAY,
  (action) => {
    return (playlistId: string) =>
      action({
        playlistId,
      });
  }
);

/**
 * Remove all items associating with each playlistId in playlistIds array from normalized listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param playlistIds An array consisting more than 1 playlistId
 * @returns REMOVE_NORM_PLAYLISTS_FROM_NORM_LIST_TO_PLAY action object
 *
 */
export const removeNormPlaylistsFromNormListToPlayAction = createAction(
  ActionTypes.REMOVE_NORM_PLAYLISTS_FROM_NORM_LIST_TO_PLAY,
  (action) => {
    return (playlistIds: string[]) =>
      action({
        playlistIds,
      });
  }
);

/**
 * Delete playlist by id
 *
 * @param id Playlist id to delete
 * @returns DELETE_PLAYLIST_BY_ID action object
 */
export const deleteNormPlaylistByIdAction = createAction(
  ActionTypes.DELETE_NORM_PLAYLIST_BY_ID,
  (action) => {
    return (id: string) =>
      action({
        id,
      });
  }
);

/**
 * Delete playlist's item and snippet by specifying itemId with the id of
 * the belonging playlist
 *
 * @param {string} playlistId Playlist id in which the playlistItem is located
 * @param {string} itemId PlaylistItem id to delete
 */
export const deleteNormPlaylistItemByIdAction = createAction(
  ActionTypes.DELETE_NORM_PLAYLIST_ITEM_BY_ID,
  (action) => {
    return (playlistId: string, itemId: string) =>
      action({
        playlistId,
        itemId,
      });
  }
);

/**
 * Update playlist name by id
 *
 * @param id Playlist id
 * @param name New name for playlist
 * @returns UPDATE_PLAYLIST_NAME_BY_ID action object
 */
export const updateNormPlaylistNameByIdAction = createAction(
  ActionTypes.UPDATE_NORM_PLAYLIST_NAME_BY_ID,
  (action) => {
    return (id: string, name: string) =>
      action({
        id,
        name,
      });
  }
);

/**
 * Add allInPlaying label to the playlist in normalized listToPlay (if all of
 * its items are in normalized listToPlay)
 *
 * @param id Playlist id to add allInPlaying label
 */
export const addAllInPlayingLabelByIdAction = createAction(
  ActionTypes.ADD_ALL_IN_PLAYING_LABEL_BY_ID,
  (action) => (id: string) => action({ id })
);

/**
 * Remove allInPlaying label of playlist, after removing it from normalized listToPlay
 * @param id Playlist id to remove allInPlaying label
 */
export const removeAllInPlayingLabelByIdAction = createAction(
  ActionTypes.REMOVE_ALL_IN_PLAYING_LABEL_BY_ID,
  (action) => (id: string) => action({ id })
);

/**
 * Shuffle norm playlist items by playlist id
 * @param id Playlist id to shuffle
 */
export const shuffleNormPlaylistItems = createAction(
  ActionTypes.SHUFFLE_NORM_PLAYLIST_ITEMS,
  (action) => (id: string) => action({ id })
);
