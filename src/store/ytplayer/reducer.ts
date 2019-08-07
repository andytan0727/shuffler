import produce, { Draft } from "immer";
import { Reducer } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { PlayerState, YTPlayerAction } from "./types";

const initialState: PlayerState = {
  playing: false,
  repeat: false,
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

export const ytplayer: Reducer<PlayerState, YTPlayerAction> = produce(
  (draft: Draft<PlayerState>, action: YTPlayerAction) => {
    switch (action.type) {
      case ActionTypes.SET_CURRENT_SONG_IDX: {
        draft.curSongIdx = action.payload.songIdx;
        return draft;
      }

      case ActionTypes.SET_VIDEO_PLAYING: {
        draft.playing = action.payload.playing;
        return draft;
      }

      case ActionTypes.TOGGLE_REPEAT: {
        draft.repeat = !draft.repeat;
        return draft;
      }

      default: {
        return draft;
      }
    }
  },
  initialState
);
