import {
  SET_PLAYLIST_URL,
  FETCH_PLAYLIST_DATA,
  ADD_FETCHED_ITEM_ID,
  SET_VIDEO_URL,
  FETCH_VIDEO_DATA,
  ADD_FETCHED_VIDEO_ID,
  FETCH_VIDEO_DATA_SUCCESS,
  FETCH_VIDEO_DATA_FAILED,
} from "../../utils/constants/actionConstants";
import { fetchYoutubeAPIData } from "../../utils/helper/fetchHelper";
import {
  addVideo,
  addListToPlay,
  addPlayingVideos,
} from "../ytplaylist/action";

/**
 * Set inputed playlist URL
 *
 * @param {string} playlistUrl
 * @return SET_PLAYLIST_URL action object for Redux
 */
export const setPlaylistUrl = (playlistUrl) => ({
  type: SET_PLAYLIST_URL,
  payload: {
    playlistUrl,
  },
});

/**
 * Add fetched playlist asynchronously to Redux
 * @param {string} url Base url for HTTP request
 * @param {object} params Extra params for request
 * @returns dispatch function for redux thunk
 */
export const fetchPlaylistData = (url, params, dataType) => {
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
 * Add fetched playlist's to Redux store
 * @param {string} id fetched item(playlist) id
 * @returns ADD_FETCHED_ITEM_ID action object for Redux
 */
export const addFetchedItemId = ({ id }) => ({
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
export const setVideoUrl = (videoUrl) => ({
  type: SET_VIDEO_URL,
  payload: {
    videoUrl,
  },
});

/**
 * Fetching videos information asynchronously from API to Redux
 * @param {string} url Base url for HTTP request
 * @param {object} params Extra params for request
 * @returns {function} thunk function for redux
 */
export const fetchVideoData = (url, params, dataType) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_VIDEO_DATA });
      const data = await fetchYoutubeAPIData(url, params, dataType);
      dispatch(fetchVideoDataSuccess(data));
    } catch (err) {
      dispatch({ type: FETCH_VIDEO_DATA_FAILED });
      throw err;
    }
  };
};

/**
 * Executes when successfully fetched video data from YouTube Data API
 *
 * @param {*} data Data obtained from YouTube Data API
 * @returns {function} thunk function for redux
 */
export const fetchVideoDataSuccess = (data) => {
  return (dispatch) => {
    const items = Array.from(data.items);
    const id = items[0].id;

    console.log(`id: ${id}`);

    dispatch({
      type: FETCH_VIDEO_DATA_SUCCESS,
      payload: {
        data,
      },
    });

    // add fetched videos to videos, listToPlay and playingVideos in redux store
    dispatch(
      addVideo({
        video: {
          id,
          items,
        },
      })
    );
    dispatch(
      addListToPlay({
        listToAdd: items,
      })
    );
    dispatch(addPlayingVideos([id]));

    // add fetched video's id to redux store
    dispatch({
      type: ADD_FETCHED_VIDEO_ID,
      payload: {
        id,
      },
    });
  };
};
