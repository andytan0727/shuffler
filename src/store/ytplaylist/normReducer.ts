import produce, { Draft, original } from "immer";
import shuffle from "lodash/shuffle";
import uniq from "lodash/uniq";
import { combineReducers } from "redux";
import { Reducer } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import {
  DeepRONormListToPlay,
  DeepRONormPlaylists,
  DeepRONormVideos,
  NormListToPlay,
  NormPlaylists,
  NormVideos,
  YTPlaylistNormedAction,
} from "./types";
import {
  deleteListToPlayItemById,
  deletePlaylistOrVideoById,
  mergeNormalizedEntities,
  updatePlaylistOrVideoNameById,
} from "./utils";

// ==================================================
// Playlists
// ==================================================
const initialPlaylistsState: DeepRONormPlaylists = {
  entities: {
    playlistItems: {},
    playlists: {},
    snippets: {},
  },
  result: [],
};

export const playlistsReducer: Reducer<
  DeepRONormPlaylists,
  YTPlaylistNormedAction
> = produce((draft: Draft<NormPlaylists>, action: YTPlaylistNormedAction) => {
  switch (action.type) {
    case ActionTypes.ADD_NORM_PLAYLIST: {
      const prevResult = original(draft.result);

      if (prevResult) {
        const { result } = action.payload;

        return mergeNormalizedEntities(draft, {
          ...action,
          payload: {
            ...action.payload,
            result: uniq([...prevResult, ...result]),
          },
        });
      }

      return draft;
    }

    case ActionTypes.DELETE_NORM_PLAYLIST_BY_ID: {
      const { id } = action.payload;

      return deletePlaylistOrVideoById(draft, id);
    }

    case ActionTypes.DELETE_NORM_PLAYLIST_ITEM_BY_ID: {
      const { playlistId, itemId } = action.payload;

      if (!draft.entities.playlistItems[itemId]) return draft;

      const itemToDelete = draft.entities.playlistItems[itemId];

      // first, delete the snippet corresponds to the playlistItem
      delete draft.entities.snippets[itemToDelete.snippet];

      // next, delete the corresponding playlistItem
      delete draft.entities.playlistItems[itemId];

      // finally, delete the itemId from items array in parent playlist
      draft.entities.playlists[playlistId].items = draft.entities.playlists[
        playlistId
      ].items.filter((id) => id !== itemId);

      return draft;
    }

    case ActionTypes.UPDATE_NORM_PLAYLIST_NAME_BY_ID: {
      const { id, name } = action.payload;

      return updatePlaylistOrVideoNameById(draft, {
        id,
        name,
        source: "playlists",
      });
    }

    case ActionTypes.ADD_ALL_IN_PLAYING_LABEL_BY_ID: {
      const { id } = action.payload;
      const playlists = draft.entities.playlists;

      if (playlists[id]) playlists[id].allInPlaying = true;

      return draft;
    }

    case ActionTypes.REMOVE_ALL_IN_PLAYING_LABEL_BY_ID: {
      const { id } = action.payload;
      const playlists = draft.entities.playlists;

      // if playlist id existed and all its items are in listToPlay previously
      if (playlists[id] && playlists[id].allInPlaying) {
        playlists[id].allInPlaying = false;
      }

      return draft;
    }

    case ActionTypes.SHUFFLE_NORM_PLAYLIST_ITEMS: {
      const { id } = action.payload;
      const prevPlaylistItems = original(draft.entities.playlists[id].items);

      if (prevPlaylistItems) {
        draft.entities.playlists[id].items = shuffle(prevPlaylistItems);
      }

      return draft;
    }

    default:
      return draft;
  }
}, initialPlaylistsState);

// ==================================================
// Videos
// ==================================================
const initialVideosState: DeepRONormVideos = {
  entities: {
    videoItems: {},
    videos: {},
    snippets: {},
  },
  result: [],
};

export const videosReducer: Reducer<
  DeepRONormVideos,
  YTPlaylistNormedAction
> = produce((draft: Draft<NormVideos>, action: YTPlaylistNormedAction) => {
  switch (action.type) {
    case ActionTypes.ADD_NORM_VIDEO: {
      const prevResult = original(draft.result);

      if (prevResult) {
        const { result } = action.payload;

        return mergeNormalizedEntities(draft, {
          ...action,
          payload: {
            ...action.payload,
            result: uniq([...prevResult, ...result]),
          },
        });
      }

      return draft;
    }

    case ActionTypes.UPDATE_NORM_VIDEO_NAME_BY_ID: {
      const { id, name } = action.payload;

      return updatePlaylistOrVideoNameById(draft, {
        id,
        name,
        source: "videos",
      });
    }

    case ActionTypes.DELETE_NORM_VIDEO_BY_ID: {
      const { id } = action.payload;

      return deletePlaylistOrVideoById(draft, id);
    }

    default: {
      return draft;
    }
  }
}, initialVideosState);

// ==================================================
// ListToPlay
// ==================================================
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
      const { source, sourceId: foreignKey, itemIds } = action.payload;

      const schema = source === "playlists" ? "playlistItems" : "videoItems";

      // clear previous state
      draft.entities.playlistItems = {};
      draft.entities.videoItems = {};
      draft.result = [];

      // update cleared states with new states
      itemIds.forEach((itemId) => {
        draft.entities[schema][itemId] = { id: itemId, foreignKey };
        draft.result.push({ id: itemId, source, schema });
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

    // NOTE: also dispatched on: ytplaylist
    case ActionTypes.CLEAR_LIST_TO_PLAY: {
      draft.entities.playlistItems = {};
      draft.entities.videoItems = {};
      draft.result = [];

      return draft;
    }

    // NOTE: also dispatched on: ytplaylist
    case ActionTypes.SHUFFLE_LIST_TO_PLAY: {
      draft.result = shuffle(draft.result);
      return draft;
    }

    default:
      return draft;
  }
}, initialListToPlayState);

export const ytplaylistNormed = combineReducers({
  playlists: playlistsReducer,
  videos: videosReducer,
  listToPlay: listToPlayReducer,
});
