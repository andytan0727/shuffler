import {
  SET_PLAYLIST_ID,
  FETCH_PLAYLIST_DATA
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

export { setPlaylistId, fetchPlaylistData };
