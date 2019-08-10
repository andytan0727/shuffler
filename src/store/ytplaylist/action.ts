import { createAction } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { Playlist, PlaylistItem, Video, VideoItem } from "./types";

// ===============================================
// Playlist
// ===============================================
/**
 * Add playlist to Redux store
 *
 * @deprecated Remove as of next stable version (v4.0)
 *
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
 * @deprecated Remove as of next stable version (v4.0)
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
 * @deprecated Remove as of next stable version (v4.0)
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
 *
 * @deprecated Remove as of next stable version (v4.0)
 *
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
 * @deprecated Remove as of next stable version (v4.0)
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
 * @deprecated Remove as of next stable version (v4.0)
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
 * @deprecated Remove as of next stable version (v4.0)
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
 * @deprecated Remove as of next stable version (v4.0)
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
