import * as ytplayerAction from "./action";
import { ActionType } from "typesafe-actions";

export interface PlayerState {
  playing: boolean;
  repeat: boolean;
  curSongIdx: number;
  playerVars: PlayerVars;
}

export interface PlayerVars {
  autoplay: number;
  controls: number;
  fs: number;
  rel: number;
  modestbranding: number;
  loop: number;
  iv_load_policy: number;
}

export type YTPlayerAction = ActionType<typeof ytplayerAction>;
