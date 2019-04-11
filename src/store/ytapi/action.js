import {
  SET_PLAYLIST_URL,
  FETCH_PLAYLIST_DATA,
  ADD_FETCHED_ITEM_ID,
  SET_VIDEO_URL,
  FETCH_VIDEO_DATA,
  ADD_FETCHED_VIDEO_ID,
} from "../../utils/constants/actionConstants";
import { fetchYoutubeAPIData } from "../../utils/helper/fetchHelper";

/**
 * Set inputed playlist URL
 *
 * @param {string} playlistUrl
 * @return SET_PLAYLIST_URL action object for Redux
 */
const setPlaylistUrl = (playlistUrl) => ({
  type: SET_PLAYLIST_URL,
  payload: {
    playlistUrl,
  },
});

/**
 *
 * Add fetched playlist asynchronously to Redux
 * @param {string} url Base url for HTTP request
 * @param {object} params Extra params for request
 * @returns dispatch function for redux thunk
 */
const fetchPlaylistData = (url, params, dataType) => {
  return async (dispatch) => {
    try {
      const data = await fetchYoutubeAPIData(url, params, dataType);
      dispatch({
        type: FETCH_PLAYLIST_DATA,
        payload: {
          data,
        },
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
 * @returns ADD_FETCHED_ITEM_ID action object for Redux
 */
const addFetchedItemId = ({ id }) => ({
  type: ADD_FETCHED_ITEM_ID,
  payload: {
    id,
  },
});

/**
 * Set inputed video URL
 *
 * @param {string} videoUrl
 * @return SET_VIDEO_URL action object for Redux
 */
const setVideoUrl = (videoUrl) => ({
  type: SET_VIDEO_URL,
  payload: {
    videoUrl,
  },
});

/**
 *
 * Add fetched video information asynchronously to Redux
 * @param {string} url Base url for HTTP request
 * @param {object} params Extra params for request
 * @returns dispatch function for redux thunk
 */
const fetchVideoData = (url, params, dataType) => {
  return async (dispatch) => {
    try {
      const data = await fetchYoutubeAPIData(url, params, dataType);
      dispatch({
        type: FETCH_VIDEO_DATA,
        payload: {
          data,
        },
      });
      return data;
    } catch (err) {
      throw err;
    }
  };
};

/**
 *
 * Add fetched video's to Redux store
 * @param {string} id fetched video id
 * @returns ADD_FETCHED_VIDEO_ID action object for Redux
 */
const addFetchedVideoId = ({ id }) => ({
  type: ADD_FETCHED_VIDEO_ID,
  payload: {
    id,
  },
});

export {
  setPlaylistUrl,
  fetchPlaylistData,
  addFetchedItemId,
  setVideoUrl,
  fetchVideoData,
  addFetchedVideoId,
};
