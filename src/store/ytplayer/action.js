import {
  SET_CURRENT_SONG_IDX,
  SET_VIDEO_PLAYING,
  TOGGLE_REPEAT,
} from "../../utils/constants/actionConstants";

/**
 * Set index of current playing song/video
 *
 * @param {number} songIdx
 * @returns {SetCurrentSongIdxAction} SET_CURRENT_SONG_IDX action object
 */
export const setCurSongIdx = (songIdx) => ({
  type: SET_CURRENT_SONG_IDX,
  payload: {
    songIdx,
  },
});

/**
 * Set whether currently video is playing or not
 *
 * @param {boolean} playing Current playing state of YT video
 * @returns {SetVideoPlayingAction} SET_VIDEO_PLAYING action object
 */
export const setVideoPlaying = (playing) => ({
  type: SET_VIDEO_PLAYING,
  payload: {
    playing,
  },
});

/**
 * Toggle video repeat setting
 * @returns {ToggleRepeatAction} TOGGLE_REPEAT action object
 *
 */
export const toggleRepeat = () => ({
  type: TOGGLE_REPEAT,
});
