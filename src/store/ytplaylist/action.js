import {
  ADD_PLAYLIST,
  SHUFFLE_PLAYLIST
} from "../../utils/constants/actionConstants";

/**
 * Add fetched playlist items to Redux store
 * @param {object} playlist An object of playlist id and items from YouTube Data API
 * @returns ADD_PLAYLIST action object for redux store
 */
const addPlaylist = playlist => ({
  type: ADD_PLAYLIST,
  payload: {
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

export { addPlaylist, shufflePlaylist };
