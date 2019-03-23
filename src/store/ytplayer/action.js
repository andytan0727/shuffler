import {
  TOGGLE_YT_PLAYING,
  SET_CURRENT_SONG_IDX
} from "../../utils/constants/actionConstants";

const toggleYTPlaying = () => ({
  type: TOGGLE_YT_PLAYING
});

const setCurSongIdx = songIdx => ({
  type: SET_CURRENT_SONG_IDX,
  payload: {
    songIdx
  }
});

export { toggleYTPlaying, setCurSongIdx };
