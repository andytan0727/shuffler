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
 * @param {*} newName New name of selected playlist
 * @returns RENAME_PLAYLIST action object for redux store
 */
const renamePlaylist = (newName) => ({
  type: RENAME_PLAYLIST,
  payload: {
    newName,
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
 * Add video to listToPlay
 * @param {boolean} checked use checkedPlaylists in Redux store if true
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
 * Add playlists in listToPlay to playingPlaylists array
 *
 * @param {*} playlists playlists' id array
 * @returns ADD_PLAYING_PLAYLISTS action object for redux store
 */
const addPlayingPlaylists = (playlists) => ({
  type: ADD_PLAYING_PLAYLISTS,
  payload: {
    playlists,
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
};
