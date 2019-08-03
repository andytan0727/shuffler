import { PlayerVars } from "react-youtube";
import { ActionType } from "typesafe-actions";

import * as ytplayerAction from "./action";

export interface PlayerState {
  playing: boolean;
  repeat: boolean;
  curSongIdx: number;
  playerVars: PlayerVars;
}

export type YTPlayerAction = ActionType<typeof ytplayerAction>;
