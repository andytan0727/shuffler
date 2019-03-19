import { ADD_PLAYLIST_ITEMS } from "../../utils/constants/actionConstants";

/**
 * Add fetched playlist items to Redux store
 * @param {*} items An array of playlist items from YouTube Data API
 * @returns action object for redux store
 */
const addPlaylistItems = items => ({
  type: ADD_PLAYLIST_ITEMS,
  payload: {
    items
  }
});

export { addPlaylistItems };
