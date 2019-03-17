import produce from "immer";
import { TOGGLE_YT_PLAYING } from "../../utils/constants/actionConstants";

const initialState = {
  playing: false,
  playerVars: {
    autoplay: 1,
    fs: 1 // prevent fullscreen
  }
};

export const ytplayer = produce((draft, action) => {
  switch (action.type) {
    case TOGGLE_YT_PLAYING: {
      draft.playing = !draft.playing;
      return draft;
    }

    default: {
      return draft;
    }
  }
}, initialState);
