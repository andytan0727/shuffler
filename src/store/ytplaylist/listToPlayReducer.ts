import produce, { Draft } from "immer";
import shuffle from "lodash/shuffle";
import { Reducer } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import {
  DeepRONormListToPlay,
  NormListToPlay,
  YTPlaylistNormedAction,
} from "./types";
import { deleteListToPlayItemById, mergeNormalizedEntities } from "./utils";

const initialListToPlayState: DeepRONormListToPlay = {
  entities: {
    playlistItems: {},
    videoItems: {},
  },
  result: [],
};

export const listToPlayReducer: Reducer<
  DeepRONormListToPlay,
  YTPlaylistNormedAction
> = produce((draft: Draft<NormListToPlay>, action: YTPlaylistNormedAction) => {
  switch (action.type) {
    // for batch addition of items directly through normalized listToPlay
    // entities and result
    case ActionTypes.ADD_UNIQUE_NORM_LIST_TO_PLAY: {
      return mergeNormalizedEntities(draft, action);
    }

    // Update entire normalized listToPlay without preserving previous details
    // mainly used for play (ONE) and only one playlist
    // without mixing other videos/playlists
    // assume all snippets in (ONE) playlist taken from API are all unique
    // No need to check for uniqueness of snippets in (ONE) playlist
    case ActionTypes.UPDATE_NORM_LIST_TO_PLAY: {
      const { schema, foreignKey, itemIds } = action.payload;

      // clear previous state
      draft.entities.playlistItems = {};
      draft.entities.videoItems = {};
      draft.result = [];

      // update cleared states with new states
      itemIds.forEach((itemId) => {
        draft.entities[schema][itemId] = { id: itemId, foreignKey };
        draft.result.push({
          id: itemId,
          schema,
        });
      });

      return draft;
    }

    case ActionTypes.DELETE_NORM_LIST_TO_PLAY_ITEM_BY_ID: {
      return deleteListToPlayItemById(draft, action.payload.id);
    }

    case ActionTypes.DELETE_NORM_LIST_TO_PLAY_ITEMS: {
      const { ids } = action.payload;

      ids.forEach((id) => {
        deleteListToPlayItemById(draft, id);
      });

      return draft;
    }

    case ActionTypes.CLEAR_LIST_TO_PLAY: {
      draft.entities.playlistItems = {};
      draft.entities.videoItems = {};
      draft.result = [];

      return draft;
    }

    case ActionTypes.SHUFFLE_LIST_TO_PLAY: {
      draft.result = shuffle(draft.result);
      return draft;
    }

    default:
      return draft;
  }
}, initialListToPlayState);
