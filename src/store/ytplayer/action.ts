import { createAction } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

/**
 * Set index of current playing song/video
 *
 * @param songIdx
 * @returns SET_CURRENT_SONG_IDX action object
 */
export const setCurSongIdx = createAction(
  ActionTypes.SET_CURRENT_SONG_IDX,
  (action) => {
    return (songIdx: number) =>
      action({
        songIdx,
      });
  }
);

/**
 * Set whether currently video is playing or not
 *
 * @param playing Current playing state of YT video
 * @returns SET_VIDEO_PLAYING action object
 */
export const setVideoPlaying = createAction(
  ActionTypes.SET_VIDEO_PLAYING,
  (action) => {
    return (playing: boolean) =>
      action({
        playing,
      });
  }
);

/**
 * Toggle video repeat setting
 * @returns TOGGLE_REPEAT action object
 *
 */
export const toggleRepeat = createAction(ActionTypes.TOGGLE_REPEAT);
