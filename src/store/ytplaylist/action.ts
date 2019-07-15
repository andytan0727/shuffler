import { createAction } from "typesafe-actions";
import * as ActionTypes from "../../utils/constants/actionConstants";
import {
  Playlist,
  PlaylistsEntities,
  Video,
  VideosEntities,
  PlaylistItem,
  VideoItem,
  ListToPlayResultItem,
  ListToPlayEntities,
} from "./types";

// ============================
// Playlist
// ============================
/**
 * Add playlist to Redux store
 * @param playlist A playlist object structured according to YouTube Data Api
 * @returns ADD_PLAYLIST action object
 */
export const addPlaylistAction = createAction(
  ActionTypes.ADD_PLAYLIST,
  (action) => {
    return (playlist: Playlist) => action({ playlist });
  }
);

/**
 * Delete playlist(s) from playlists
 *
 * @param playlistIds Playlist id(s) to remove
 * @returns DELETE_PLAYLISTS action object
 */
export const deletePlaylistsAction = createAction(
  ActionTypes.DELETE_PLAYLISTS,
  (action) => {
    return (playlistIds: string[]) => action({ playlistIds });
  }
);

/**
 * Rename selected playlist (one at once)
 *
 * @param newName New name of selected playlist
 * @param playlistIdToRename Selected playlist's id
 * @returns RENAME_PLAYLIST action object
 */
export const renamePlaylistAction = createAction(
  ActionTypes.RENAME_PLAYLIST,
  (action) => {
    return (newName: string, playlistIdToRename: string) =>
      action({ newName, playlistIdToRename });
  }
);

/**
 * Set checked playlist in Redux store
 * @param checkedPlaylists selected playlists
 * @returns SET_CHECKED_PLAYLISTS action object for redux store
 */
export const setCheckedPlaylistsAction = createAction(
  ActionTypes.SET_CHECKED_PLAYLISTS,
  (action) => {
    return (checkedPlaylists: string[]) => action({ checkedPlaylists });
  }
);

/**
 * Add playlist id(s) in playlistIds to playingPlaylists
 *
 * @param playlistIds Playlists' id to add
 * @returns ADD_PLAYING_PLAYLISTS action object
 */
export const addPlayingPlaylistsAction = createAction(
  ActionTypes.ADD_PLAYING_PLAYLISTS,
  (action) => {
    return (playlistIds: string[]) =>
      action({
        playlistIds,
      });
  }
);

/**
 * Remove playlist id(s) in playlistIds from playingPlaylists
 *
 * @param playlistIds Playlists' id to remove
 * @returns REMOVE_PLAYING_PLAYLISTS action object
 */
export const removePlayingPlaylistsAction = createAction(
  ActionTypes.REMOVE_PLAYING_PLAYLISTS,
  (action) => {
    return (playlistIds: string[]) =>
      action({
        playlistIds,
      });
  }
);

/**
 * Add playlists to listToPlay
 *
 * @param playlistIds Id array of playlists to add to listToPlay
 * @returns ADD_PLAYLISTS_TO_LIST_TO_PLAY action object
 */
export const addPlaylistsToListToPlayAction = createAction(
  ActionTypes.ADD_PLAYLISTS_TO_LIST_TO_PLAY,
  (action) => {
    return (playlistIds: string[]) =>
      action({
        playlistIds,
      });
  }
);

/**
 * Remove playlist(s) from current playing list (listToPlay)
 *
 * @param playlistIds An array of playlist Ids to remove
 * @returns REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY action object
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
 * Add normalized fetched playlist data to redux store
 *
 * @param entities Normalized states entities of playlists
 * @param result Normalized states result of playlists
 * @returns ADD_FETCHED_PLAYLIST action object
 */
export const addFetchedPlaylistAction = createAction(
  ActionTypes.ADD_FETCHED_PLAYLIST,
  (action) => {
    return (entities: PlaylistsEntities, result: string[]) =>
      action({
        entities,
        result,
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
 * Action to label whole playlist in playing (listToPlay) if all of its items
 * are in listToPlay
 *
 * @param id Playlist id to label/set
 */
export const setWholePlaylistInPlayingByIdAction = createAction(
  ActionTypes.SET_WHOLE_PLAYLIST_IN_PLAYING_BY_ID,
  (action) => {
    return (id: string) =>
      action({
        id,
      });
  }
);

// ===============================================
// videos
// ===============================================
/**
 * Add fetched video to Redux store
 * @param videoToAdd An object of video id and items from YouTube Data API
 * @returns ADD_VIDEO action object
 */
export const addVideoAction = createAction(ActionTypes.ADD_VIDEO, (action) => {
  return (videoToAdd: Video) =>
    action({
      videoToAdd,
    });
});

/**
 * Delete selected videos from redux store
 *
 * @param videoIds An array of video ids to delete
 * @returns DELETE_VIDEOS action object
 */
export const deleteVideosAction = createAction(
  ActionTypes.DELETE_VIDEOS,
  (action) => {
    return (videoIds: string[]) =>
      action({
        videoIds,
      });
  }
);

/**
 * Set checked videos in Redux store
 * @param checkedVideos An array of checked video id to store
 * @returns SET_CHECKED_VIDEOS action object for redux store
 */
export const setCheckedVideosAction = createAction(
  ActionTypes.SET_CHECKED_VIDEOS,
  (action) => {
    return (checkedVideos: string[]) =>
      action({
        checkedVideos,
      });
  }
);

/**
 * Add videos' id specified by videoIds array to playingVideos
 *
 * @param videoIds Videos id array
 * @returns ADD_PLAYING_VIDEOS action object
 */
export const addPlayingVideosAction = createAction(
  ActionTypes.ADD_PLAYING_VIDEOS,
  (action) => {
    return (videoIds: string[]) =>
      action({
        videoIds,
      });
  }
);

/**
 * Remove videos specified by videoIds array from playingVideos
 *
 * @param videoIds An array of video ids to remove from playingVideos
 * @returns REMOVE_PLAYING_VIDEOS action object
 */
export const removePlayingVideosAction = createAction(
  ActionTypes.REMOVE_PLAYING_VIDEOS,
  (action) => {
    return (videoIds: string[]) =>
      action({
        videoIds,
      });
  }
);

/**
 * Add video items to listToPlay
 *
 * @param videoIds Video ids array to add
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
 * Remove video(s) from current playing list (listToPlay)
 *
 * @param videoIds An array of video Ids to remove
 * @returns REMOVE_VIDEOS_FROM_LIST_TO_PLAY action object
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

/**
 * Toggle add or remove video from listToPlay
 *
 * @param videoId Id of video to toggle add or remove
 * @returns TOGGLE_PLAYING_VIDEO action object
 */
export const togglePlayingVideoAction = createAction(
  ActionTypes.TOGGLE_PLAYING_VIDEO,
  (action) => {
    return (videoId: string) =>
      action({
        videoId,
      });
  }
);

/**
 * Add fetched video data from API to redux store
 *
 * @param entities Normalized videos entities from videos states
 * @param result Normalized videos result from videos states
 * @returns ADD_FETCHED_VIDEO action object
 */
export const addFetchedVideoAction = createAction(
  ActionTypes.ADD_FETCHED_VIDEO,
  (action) => {
    return (entities: VideosEntities, result: string[]) =>
      action({
        entities,
        result,
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

// ===============================================
// listToPlay
// ===============================================
/**
 *
 * @param items Items obtained from API (items key in json returned)
 * @returns APPEND_LIST_TO_PLAY action object
 */
export const appendListToPlayAction = createAction(
  ActionTypes.APPEND_LIST_TO_PLAY,
  (action) => {
    return (items: (PlaylistItem | VideoItem)[]) =>
      action({
        items,
      });
  }
);

/**
 * Remove item(s) containing itemIds from listToPlay
 *
 * @param itemIds Playlist/Video' ids
 * @param itemType  Type of item to remove (playlist/video)
 * @returns REMOVE_FROM_LIST_TO_PLAY action object
 */
export const removeFromListToPlayAction = createAction(
  ActionTypes.REMOVE_FROM_LIST_TO_PLAY,
  (action) => {
    return (itemIds: string[], itemType: MediaSourceType) =>
      action({
        itemIds,
        itemType,
      });
  }
);

/**
 * Update listToPlay with updatedList supplied
 *
 * @param updatedList Updated array of listToPlay
 * @returns UPDATE_LIST_TO_PLAY action object
 */
export const updateListToPlayAction = createAction(
  ActionTypes.UPDATE_LIST_TO_PLAY,
  (action) => {
    return (updatedList: (PlaylistItem | VideoItem)[]) =>
      action({
        listToPlay: updatedList,
      });
  }
);

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

/**
 * Add per item to listToPlay
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
 * Add normalized listToPlay entities to store
 *
 * @param entities Normalized entities of listToPlay
 * @param result Normalized result of listToPlay
 * @returns ADD_LIST_TO_PLAY_ITEMS action object
 */
export const addListToPlayItemsAction = createAction(
  ActionTypes.ADD_LIST_TO_PLAY_ITEMS,
  (action) => {
    return (entities: ListToPlayEntities, result: ListToPlayResultItem[]) =>
      action({
        entities,
        result,
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
