import produce, { Draft, original } from "immer";
import uniqBy from "lodash/uniqBy";
import { Reducer } from "redux";
import * as ActionTypes from "utils/constants/actionConstants";

import {
  DeepROYtPlaylistState,
  YTPlaylistAction,
  YTPlaylistState,
} from "./types";

const initialState: DeepROYtPlaylistState = {
  listToPlay: [],
};

export const ytplaylist: Reducer<
  DeepROYtPlaylistState,
  YTPlaylistAction
> = produce((draft: Draft<YTPlaylistState>, action: YTPlaylistAction) => {
  switch (action.type) {
    // ------------------------------------------
    // list to play / playingList
    // ------------------------------------------
    // NOTE: TESTED
    case ActionTypes.APPEND_LIST_TO_PLAY: {
      const items = action.payload.items;
      const prevListToPlay = original(draft.listToPlay);

      if (prevListToPlay)
        draft.listToPlay = uniqBy([...prevListToPlay, ...items], "id");

      return draft;
    }

    // NOTE: TESTED
    case ActionTypes.REMOVE_FROM_LIST_TO_PLAY: {
      const { itemIds, itemType } = action.payload;
      const prevListToPlay = original(draft.listToPlay);

      if (prevListToPlay)
        draft.listToPlay = prevListToPlay.filter((item) =>
          itemType === "playlists" && "playlistId" in item.snippet
            ? !itemIds.includes(item.snippet.playlistId)
            : !itemIds.includes(item.id)
        );

      return draft;
    }

    default: {
      return draft;
    }
  }
}, initialState);
