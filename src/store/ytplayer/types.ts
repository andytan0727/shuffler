import * as ytplayerAction from "./action";
import { ActionType } from "typesafe-actions";
import { PlayerVars } from "react-youtube";

export interface PlayerState {
  playing: boolean;
  repeat: boolean;
  curSongIdx: number;
  playerVars: PlayerVars;
}

export type YTPlayerAction = ActionType<typeof ytplayerAction>;
