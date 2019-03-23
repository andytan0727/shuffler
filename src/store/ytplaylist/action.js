import { ADD_PLAYLIST } from "../../utils/constants/actionConstants";

/**
 * Add fetched playlist items to Redux store
 * @param {object} playlist An object of playlist id and items from YouTube Data API
 * @returns action object for redux store
 */
const addPlaylist = playlist => ({
  type: ADD_PLAYLIST,
  payload: {
    playlist
  }
});

export { addPlaylist };
