import {
  ADD_PLAYLIST,
  REMOVE_PLAYLIST,
  RENAME_PLAYLIST,
  SET_CHECKED_PLAYLISTS,
  SHUFFLE_PLAYLIST,
  SET_LOADED_FROM_DB,
  ADD_LIST_TO_PLAY,
  ADD_PLAYING_PLAYLISTS,
  CLEAR_LIST_TO_PLAY,

  // videos
  ADD_VIDEO,
  REMOVE_VIDEO,
  RENAME_VIDEO,
  SET_CHECKED_VIDEOS,
  ADD_PLAYING_VIDEOS,
} from "../../utils/constants/actionConstants";

/**
 * Add fetched playlist items to Redux store
 * @param {boolean} persist persist to indexedDB
 * @param {object} playlist An object of playlist id and items from YouTube Data API
 * @returns ADD_PLAYLIST action object for redux store
 */
const addPlaylist = ({ persist, playlist }) => ({
  type: ADD_PLAYLIST,
  payload: {
    persist,
    playlist,
  },
});

/**
 * Remove checked playlist in checkedPlaylists array
 * @returns REMOVE_PLAYLIST action object for redux store
 */
const removePlaylist = () => ({
  type: REMOVE_PLAYLIST,
});

/**
 * Rename selected playlist (one at once)
 *
 * @param {string} newName New name of selected playlist
 * @param {string} playlistId selected playlist's id
 * @returns RENAME_PLAYLIST action object for redux store
 */
const renamePlaylist = (newName, playlistId) => ({
  type: RENAME_PLAYLIST,
  payload: {
    newName,
    playlistId,
  },
});

/**
 * Set checked playlist in Redux store
 * @param {array} checkedPlaylists checkedPlaylists in SavedPlaylist component
 * @returns SET_CHECKED_PLAYLISTS action object for redux store
 */
const setCheckedPlaylists = (checkedPlaylists) => ({
  type: SET_CHECKED_PLAYLISTS,
  payload: {
    checkedPlaylists,
  },
});

/**
 * Shuffle fetched playlists into one combined playlist
 * @returns SHUFFLE_PLAYLIST action object for redux store
 *
 */
const shufflePlaylist = () => ({
  type: SHUFFLE_PLAYLIST,
});

/**
 * Set loadedFromDB to true if data is persisted and loaded from indexedDB
 * @returns SET_LOADED_FROM_DB action object for redux store
 *
 */
const setLoadedFromDB = () => ({
  type: SET_LOADED_FROM_DB,
});

/**
 * Add playlists in listToPlay to playingPlaylists array
 *
 * @param {array} playlists playlists' id array
 * @param {boolean} persist persist to indexedDB
 * @returns ADD_PLAYING_PLAYLISTS action object for redux store
 */
const addPlayingPlaylists = (playlists, persist) => ({
  type: ADD_PLAYING_PLAYLISTS,
  payload: {
    playlists,
    persist,
  },
});

// -----------------------------------------------
// videos
// -----------------------------------------------
/**
 * Add fetched video to Redux store
 * @param {boolean} persist persist to indexedDB
 * @param {object} playlist An object of video id and items from YouTube Data API
 * @returns ADD_VIDEO action object for redux store
 */
const addVideo = ({ persist, video }) => ({
  type: ADD_VIDEO,
  payload: {
    persist,
    video,
  },
});

/**
 * Remove checked video in checkedVideos array
 * @returns REMOVE_VIDEO action object for redux store
 */
const removeVideo = () => ({
  type: REMOVE_VIDEO,
});

/**
 * Rename selected video (one at once)
 *
 * @param {*} newName New name of selected video
 * @returns RENAME_VIDEO action object for redux store
 */
const renameVideo = (newName) => ({
  type: RENAME_VIDEO,
  payload: {
    newName,
  },
});

/**
 * Set checked videos in Redux store
 * @param {array} checkedVideos checkedVideos array
 * @returns SET_CHECKED_VIDEOS action object for redux store
 */
const setCheckedVideos = (checkedVideos) => ({
  type: SET_CHECKED_VIDEOS,
  payload: {
    checkedVideos,
  },
});

/**
 * Add videos in listToPlay to playingVideos array
 *
 * @param {array} videosId videos id array
 * @param {boolean} persist persist to indexedDB
 * @returns ADD_PLAYING_VIDEOS action object for redux store
 */
const addPlayingVideos = (videosId, persist) => ({
  type: ADD_PLAYING_VIDEOS,
  payload: {
    videosId,
    persist,
  },
});

/**
 * Add playlists/videos to listToPlay
 * @param {boolean} checked use checkedPlaylists/checkedVideos in Redux store if true
 * @param {boolean} persist persist to indexedDB
 * @param {object} listToAdd An array of video to add

 * @returns ADD_LIST_TO_PLAY action object for redux store
 */
const addListToPlay = ({ checked, persist, listToAdd }) => ({
  type: ADD_LIST_TO_PLAY,
  payload: {
    checked,
    persist,
    listToAdd,
  },
});

/**
 * Clear current playing playlist
 * @returns CLEAR_LIST_TO_PLAY action object for redux store
 */
const clearListToPlay = () => ({
  type: CLEAR_LIST_TO_PLAY,
});

export {
  addPlaylist,
  removePlaylist,
  renamePlaylist,
  setCheckedPlaylists,
  shufflePlaylist,
  setLoadedFromDB,
  addListToPlay,
  addPlayingPlaylists,
  clearListToPlay,
  // videos
  addVideo,
  removeVideo,
  renameVideo,
  setCheckedVideos,
  addPlayingVideos,
};
