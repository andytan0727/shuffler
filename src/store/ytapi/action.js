import {
  SET_PLAYLIST_ID,
  FETCH_PLAYLIST_DATA,
  ADD_FETCHED_ITEM_ID
} from "../../utils/constants/actionConstants";
import { fetchPlaylistItems } from "../../utils/helper/fetchHelper";

const setPlaylistId = playlistId => ({
  type: SET_PLAYLIST_ID,
  payload: {
    playlistId
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
 * @param {boolean} persist persist to indexedDB
 * @param {string} id fetched item(playlist) id
 * @returns action object for Redux
 */
const addFetchedItemId = ({persist, id}) => ({
  type: ADD_FETCHED_ITEM_ID,
  payload: {
    persist,
    id
  }
});

export { setPlaylistId, fetchPlaylistData, addFetchedItemId };
