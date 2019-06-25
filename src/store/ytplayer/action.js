import {
  SET_CURRENT_SONG_IDX,
  SET_VIDEO_PLAYING,
  TOGGLE_REPEAT,
} from "../../utils/constants/actionConstants";

export const setCurSongIdx = (songIdx) => ({
  type: SET_CURRENT_SONG_IDX,
  payload: {
    songIdx,
  },
});

export const setVideoPlaying = (playing) => ({
  type: SET_VIDEO_PLAYING,
  payload: {
    playing,
  },
});

export const toggleRepeat = () => ({
  type: TOGGLE_REPEAT,
});
