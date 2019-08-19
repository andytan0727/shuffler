import { createAction } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { PlaylistsEntities } from "./types";

/**
 * Add fetched playlist data to redux store
 *
 * @param entities Normalized states entities of playlists
 * @param result Normalized states result of playlists
 * @returns ADD_FETCHED_PLAYLIST action object
 */
export const addPlaylistAction = createAction(
  ActionTypes.ADD_PLAYLIST,
  (action) => {
    return (entities: PlaylistsEntities, result: string[]) =>
      action({
        entities,
        result,
      });
  }
);

/**
 * Add all items in the specified playlist into listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param playlistId Playlist id
 * @returns ADD_PLAYLIST_TO_LIST_TO_PLAY action object
 */
export const addPlaylistToListToPlayAction = createAction(
  ActionTypes.ADD_PLAYLIST_TO_LIST_TO_PLAY,
  (action) => {
    return (playlistId: string) =>
      action({
        playlistId,
      });
  }
);

/**
 * Remove all items in the specified playlist from listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param playlistId Playlist id
 *
 */
export const removePlaylistFromListToPlayAction = createAction(
  ActionTypes.REMOVE_PLAYLIST_FROM_LIST_TO_PLAY,
  (action) => {
    return (playlistId: string) =>
      action({
        playlistId,
      });
  }
);

/**
 * Remove all items associating with each playlistId in playlistIds array from listToPlay
 *
 * **_Note: This action is handled through saga. No reducer logic involved_**
 *
 * @param playlistIds An array consisting more than 1 playlistId
 * @returns REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY action object
 *
 */
export const removePlaylistsFromListToPlayAction = createAction(
  ActionTypes.REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY,
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
export const deletePlaylistByIdAction = createAction(
  ActionTypes.DELETE_PLAYLIST_BY_ID,
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
export const deletePlaylistItemByIdAction = createAction(
  ActionTypes.DELETE_PLAYLIST_ITEM_BY_ID,
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
export const updatePlaylistNameByIdAction = createAction(
  ActionTypes.UPDATE_PLAYLIST_NAME_BY_ID,
  (action) => {
    return (id: string, name: string) =>
      action({
        id,
        name,
      });
  }
);

/**
 * Add allInPlaying label to the playlist in listToPlay (if all of
 * its items are in listToPlay)
 *
 * @param id Playlist id to add allInPlaying label
 */
export const addAllInPlayingLabelByIdAction = createAction(
  ActionTypes.ADD_ALL_IN_PLAYING_LABEL_BY_ID,
  (action) => (id: string) => action({ id })
);

/**
 * Remove allInPlaying label of playlist, after removing it from listToPlay
 * @param id Playlist id to remove allInPlaying label
 */
export const removeAllInPlayingLabelByIdAction = createAction(
  ActionTypes.REMOVE_ALL_IN_PLAYING_LABEL_BY_ID,
  (action) => (id: string) => action({ id })
);

/**
 * Add partialInPlaying label to particular playlist
 * if some of its items are in listToPlay
 *
 * @param id Playlist id to add partialInPlaying label
 */
export const addPartialInPlayingLabelByIdAction = createAction(
  ActionTypes.ADD_PARTIAL_IN_PLAYING_LABEL_BY_ID,
  (action) => (id: string) => action({ id })
);

/**
 * Remove partialInPlaying label of particular playlist
 * @param id Playlist id to remove partialInPlaying label
 */
export const removePartialInPlayingLabelByIdAction = createAction(
  ActionTypes.REMOVE_PARTIAL_IN_PLAYING_LABEL_BY_ID,
  (action) => (id: string) => action({ id })
);

/**
 * Shuffle playlist items by playlist id
 * @param id Playlist id to shuffle
 */
export const shufflePlaylistItems = createAction(
  ActionTypes.SHUFFLE_PLAYLIST_ITEMS,
  (action) => (id: string) => action({ id })
);
