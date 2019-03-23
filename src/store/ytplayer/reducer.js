import produce from "immer";
import {
  TOGGLE_YT_PLAYING,
  SET_CURRENT_SONG_IDX
} from "../../utils/constants/actionConstants";

const initialState = {
  playing: false,
  curSongIdx: 0,
  playerVars: {
    autoplay: 1,
    controls: 0,
    fs: 0, // prevent fullscreen
    rel: 0,
    modestbranding: 1,
    loop: 0,
    iv_load_policy: 3
  }
};

export const ytplayer = produce((draft, action) => {
  switch (action.type) {
    case TOGGLE_YT_PLAYING: {
      draft.playing = !draft.playing;
      return draft;
    }

    case SET_CURRENT_SONG_IDX: {
      draft.curSongIdx = action.payload.songIdx;
      return draft;
    }

    default: {
      return draft;
    }
  }
}, initialState);
