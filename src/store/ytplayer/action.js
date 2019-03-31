import {
  SET_CURRENT_SONG_IDX,
  SET_VIDEO_PLAYING,
} from "../../utils/constants/actionConstants";

const setCurSongIdx = (songIdx) => ({
  type: SET_CURRENT_SONG_IDX,
  payload: {
    songIdx,
  },
});

const setVideoPlaying = (playing) => ({
  type: SET_VIDEO_PLAYING,
  payload: {
    playing,
  },
});

export { setCurSongIdx, setVideoPlaying };
