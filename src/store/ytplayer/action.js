import { SET_CURRENT_SONG_IDX } from "../../utils/constants/actionConstants";

const setCurSongIdx = songIdx => ({
  type: SET_CURRENT_SONG_IDX,
  payload: {
    songIdx
  }
});

export { setCurSongIdx };
