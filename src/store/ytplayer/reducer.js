import produce from "immer";
import {
  SET_CURRENT_SONG_IDX,
  SET_VIDEO_PLAYING,
} from "../../utils/constants/actionConstants";

const initialState = {
  playing: false,
  curSongIdx: 0,
  playerVars: {
    autoplay: 1,
    controls: 1,
    fs: 1, // prevent fullscreen
    rel: 0,
    modestbranding: 1,
    loop: 0,
    iv_load_policy: 3,
  },
};

export const ytplayer = produce((draft, action) => {
  switch (action.type) {
    case SET_CURRENT_SONG_IDX: {
      draft.curSongIdx = action.payload.songIdx;
      return draft;
    }

    case SET_VIDEO_PLAYING: {
      draft.playing = action.payload.playing;
      return draft;
    }

    default: {
      return draft;
    }
  }
}, initialState);
