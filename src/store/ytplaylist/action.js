import {
  ADD_PLAYLIST,
  RENAME_PLAYLIST,
  SET_CHECKED_PLAYLISTS,
  ADD_PLAYING_PLAYLISTS,
  UPDATE_LIST_TO_PLAY,
  CLEAR_LIST_TO_PLAY,

  // videos
  ADD_VIDEO,
  SET_CHECKED_VIDEOS,
  ADD_PLAYING_VIDEOS,
  REMOVE_PLAYING_VIDEOS,
  TOGGLE_PLAYING_VIDEO,
  APPEND_LIST_TO_PLAY,
  REMOVE_PLAYING_PLAYLISTS,
  DELETE_PLAYLISTS,
  REMOVE_FROM_LIST_TO_PLAY,
  SHUFFLE_LIST_TO_PLAY,
  REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY,
  DELETE_VIDEOS,
  REMOVE_VIDEOS_FROM_LIST_TO_PLAY,
  ADD_PLAYLISTS_TO_LIST_TO_PLAY,
  ADD_VIDEOS_TO_LIST_TO_PLAY,
} from "../../utils/constants/actionConstants";

// ============================
// Playlist
// ============================
/**
 * Add playlist to Redux store
 * @param {Playlist} playlist A playlist object structured according to YouTube Data Api
 * @returns {AddPlaylistAction} ADD_PLAYLIST action object
 */

export const addPlaylistAction = (playlist) => ({
  type: ADD_PLAYLIST,
  payload: {
    playlist,
  },
});

/**
 * Delete playlist(s) from playlists
 *
 * @param {Array<string>} playlistIds Playlist id(s) to remove
 * @returns {DeletePlaylistsAction} DELETE_PLAYLISTS action object
 */
export const deletePlaylistsAction = (playlistIds) => ({
  type: DELETE_PLAYLISTS,
  payload: {
    playlistIds,
  },
});

/**
 * Rename selected playlist (one at once)
 *
 * @param {string} newName New name of selected playlist
 * @param {string} playlistIdToRename Selected playlist's id
 * @returns {RenamePlaylistAction} RENAME_PLAYLIST action object
 */
export const renamePlaylistAction = (newName, playlistIdToRename) => ({
  type: RENAME_PLAYLIST,
  payload: {
    newName,
    playlistIdToRename,
  },
});

/**
 * Set checked playlist in Redux store
 * @param {Array<string>} checkedPlaylists selected playlists
 * @returns {SetCheckedPlaylistsAction} SET_CHECKED_PLAYLISTS action object for redux store
 */
export const setCheckedPlaylistsAction = (checkedPlaylists) => ({
  type: SET_CHECKED_PLAYLISTS,
  payload: {
    checkedPlaylists,
  },
});

/**
 * Add playlist id(s) in playlistIds to playingPlaylists
 *
 * @param {Array<string>} playlistIds Playlists' id to add
 * @returns {AddPlayingPlaylistsAction} ADD_PLAYING_PLAYLISTS action object
 */
export const addPlayingPlaylistsAction = (playlistIds) => ({
  type: ADD_PLAYING_PLAYLISTS,
  payload: {
    playlistIds,
  },
});

/**
 * Remove playlist id(s) in playlistIds from playingPlaylists
 *
 * @param {Array<string>} playlistIds Playlists' id to remove
 * @returns {RemovePlayingPlaylistsAction} REMOVE_PLAYING_PLAYLISTS action object
 */
export const removePlayingPlaylistsAction = (playlistIds) => ({
  type: REMOVE_PLAYING_PLAYLISTS,
  payload: {
    playlistIds,
  },
});

/**
 * Add playlists to listToPlay
 *
 * @param {Array<string>} playlistIds Id array of playlists to add to listToPlay
 * @returns {AddPlaylistsToListToPlayAction} ADD_PLAYLISTS_TO_LIST_TO_PLAY action object
 */
export const addPlaylistsToListToPlayAction = (playlistIds) => ({
  type: ADD_PLAYLISTS_TO_LIST_TO_PLAY,
  payload: {
    playlistIds,
  },
});

/**
 * Remove playlist(s) from current playing list (listToPlay)
 *
 * @param {Array<string>} playlistIds An array of playlist Ids to remove
 * @returns {RemovePlaylistsFromListToPlayAction} REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY action object
 */
export const removePlaylistsFromListToPlayAction = (playlistIds) => ({
  type: REMOVE_PLAYLISTS_FROM_LIST_TO_PLAY,
  payload: {
    playlistIds,
  },
});

// ===============================================
// videos
// ===============================================
/**
 * Add fetched video to Redux store
 * @param {Video} videoToAdd An object of video id and items from YouTube Data API
 * @returns {AddVideoAction} ADD_VIDEO action object
 */
export const addVideoAction = (videoToAdd) => ({
  type: ADD_VIDEO,
  payload: {
    videoToAdd,
  },
});

/**
 * Delete selected videos from redux store
 *
 * @param {Array<string>} videoIds An array of video ids to delete
 * @returns {DeleteVideosAction} DELETE_VIDEOS action object
 */
export const deleteVideosAction = (videoIds) => ({
  type: DELETE_VIDEOS,
  payload: {
    videoIds,
  },
});

/**
 * Set checked videos in Redux store
 * @param {Array<string>} checkedVideos An array of checked video id to store
 * @returns {SetCheckedVideosAction} SET_CHECKED_VIDEOS action object for redux store
 */
export const setCheckedVideosAction = (checkedVideos) => ({
  type: SET_CHECKED_VIDEOS,
  payload: {
    checkedVideos,
  },
});

/**
 * Add videos' id specified by videoIds array to playingVideos
 *
 * @param {Array<string>} videoIds Videos id array
 * @returns {AddPlayingVideoAction} ADD_PLAYING_VIDEOS action object
 */
export const addPlayingVideosAction = (videoIds) => ({
  type: ADD_PLAYING_VIDEOS,
  payload: {
    videoIds,
  },
});

/**
 * Remove videos specified by videoIds array from playingVideos
 *
 * @param {Array<string>} videoIds An array of video ids to remove from playingVideos
 * @returns {RemovePlayingVideosAction} REMOVE_PLAYING_VIDEOS action object
 */
export const removePlayingVideosAction = (videoIds) => ({
  type: REMOVE_PLAYING_VIDEOS,
  payload: {
    videoIds,
  },
});

/**
 * Add video items to listToPlay
 *
 * @param {Array<string>} videoIds Video ids array to add
 * @returns {AddVideosToListToPlayAction} ADD_VIDEOS_TO_LIST_TO_PLAY action object
 */
export const addVideosToListToPlayAction = (videoIds) => ({
  type: ADD_VIDEOS_TO_LIST_TO_PLAY,
  payload: {
    videoIds,
  },
});

/**
 * Remove video(s) from current playing list (listToPlay)
 *
 * @param {Array<string>} videoIds An array of video Ids to remove
 * @returns {RemoveVideosFromListToPlayAction} REMOVE_VIDEOS_FROM_LIST_TO_PLAY action object
 */
export const removeVideosFromListToPlayAction = (videoIds) => ({
  type: REMOVE_VIDEOS_FROM_LIST_TO_PLAY,
  payload: {
    videoIds,
  },
});

/**
 * Toggle add or remove video from listToPlay
 *
 * @param {string} videoId Id of video to toggle add or remove
 * @returns {TogglePlayingVideoAction} TOGGLE_PLAYING_VIDEO action object
 */
export const togglePlayingVideoAction = (videoId) => ({
  type: TOGGLE_PLAYING_VIDEO,
  payload: {
    videoId,
  },
});

// ===============================================
// listToPlay
// ===============================================
/**
 *
 * @param {Array<(PlaylistItem | VideoItem)>} items Items obtained from API (items key in json returned)
 * @returns {AppendListToPlayAction} APPEND_LIST_TO_PLAY action object
 */
export const appendListToPlayAction = (items) => ({
  type: APPEND_LIST_TO_PLAY,
  payload: {
    items,
  },
});

/**
 * Remove item(s) containing itemIds from listToPlay
 *
 * @param {Array<string>} itemIds Playlist/Video' ids
 * @param {ItemType} itemType  Type of item to remove (playlist/video)
 */
export const removeFromListToPlayAction = (itemIds, itemType) => ({
  type: REMOVE_FROM_LIST_TO_PLAY,
  payload: {
    itemIds,
    itemType,
  },
});

/**
 * Update listToPlay with updatedList supplied
 *
 * @param {Array<(PlaylistItem | VideoItem)>} updatedList Updated array of listToPlay
 * @returns {UpdateListToPlayAction} UPDATE_LIST_TO_PLAY action object
 */
export const updateListToPlay = (updatedList) => ({
  type: UPDATE_LIST_TO_PLAY,
  payload: {
    listToPlay: updatedList,
  },
});

/**
 * Clear current playing playlist
 * @returns {ClearListToPlayAction} CLEAR_LIST_TO_PLAY action object for redux store
 */
export const clearListToPlayAction = () => ({
  type: CLEAR_LIST_TO_PLAY,
});

/**
 * Shuffle listToPlay
 *
 * @returns {ShuffleListToPlayAction} SHUFFLE_LIST_TO_PLAY action object
 */
export const shuffleListToPlayAction = () => ({
  type: SHUFFLE_LIST_TO_PLAY,
});
