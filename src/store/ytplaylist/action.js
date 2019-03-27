import {
  ADD_PLAYLIST,
  SHUFFLE_PLAYLIST,
  SET_LOADED_FROM_DB,
  ADD_LIST_TO_PLAY
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
    playlist
  }
});

/**
 * Shuffle fetched playlists into one combined playlist
 * @returns SHUFFLE_PLAYLIST action object for redux store
 *
 */
const shufflePlaylist = () => ({
  type: SHUFFLE_PLAYLIST
});

/**
 * Set loadedFromDB to true if data is persisted and loaded from indexedDB
 * @returns SET_LOADED_FROM_DB action object for redux store
 *
 */
const setLoadedFromDB = () => ({
  type: SET_LOADED_FROM_DB
});

/**
 * Add video to listToPlay
 * @param {boolean} persist persist to indexedDB
 * @param {object} listToAdd An array of video to add
 * @returns ADD_LIST_TO_PLAY action object for redux store
 */
const addListToPlay = ({ persist, listToAdd }) => ({
  type: ADD_LIST_TO_PLAY,
  payload: {
    persist,
    listToAdd
  }
});

export { addPlaylist, shufflePlaylist, setLoadedFromDB, addListToPlay };
