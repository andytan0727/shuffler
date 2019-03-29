import {
  SET_PLAYLIST_URL,
  FETCH_PLAYLIST_DATA,
  ADD_FETCHED_ITEM_ID
} from "../../utils/constants/actionConstants";
import { fetchPlaylistItems } from "../../utils/helper/fetchHelper";

const setPlaylistUrl = playlistUrl => ({
  type: SET_PLAYLIST_URL,
  payload: {
    playlistUrl
  }
});

/**
 *
 * Add fetched data asynchronously to Redux
 * @param {string} url Base url for HTTP request
 * @param {object} params Extra params for request
 * @returns dispatch function for redux thunk
 */
const fetchPlaylistData = (url, params) => {
  return async dispatch => {
    try {
      const data = await fetchPlaylistItems(url, params);
      dispatch({
        type: FETCH_PLAYLIST_DATA,
        payload: {
          data
        }
      });
      return data;
    } catch (err) {
      throw err;
    }
  };
};

/**
 *
 * Add fetched playlist's to Redux store
 * @param {string} id fetched item(playlist) id
 * @returns action object for Redux
 */
const addFetchedItemId = ({ id }) => ({
  type: ADD_FETCHED_ITEM_ID,
  payload: {
    id
  }
});

export { setPlaylistUrl, fetchPlaylistData, addFetchedItemId };
