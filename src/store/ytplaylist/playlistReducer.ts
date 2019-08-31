import produce, { Draft, original } from "immer";
import shuffle from "lodash/shuffle";
import { Reducer } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import { DeepReadonlyPlaylists, Playlists, YTPlaylistActions } from "./types";
import {
  deepMergeStates,
  deletePlaylistItem,
  deletePlaylistOrVideoById,
  updatePlaylistOrVideoNameById,
} from "./utils";

const initialPlaylistsState: DeepReadonlyPlaylists = {
  updating: false,
  entities: {
    playlistItems: {},
    playlists: {},
    snippets: {},
  },
  result: [],
};

export const playlistsReducer: Reducer<
  DeepReadonlyPlaylists,
  YTPlaylistActions
> = produce((draft: Draft<Playlists>, action: YTPlaylistActions) => {
  switch (action.type) {
    case ActionTypes.ADD_PLAYLIST: {
      const { entities, result } = action.payload;
      return deepMergeStates(draft, entities, result);
    }

    case ActionTypes.DELETE_PLAYLIST_BY_ID: {
      const { id } = action.payload;
      return deletePlaylistOrVideoById(draft, id);
    }

    case ActionTypes.DELETE_PLAYLIST_ITEM_BY_ID: {
      const { playlistId, itemId } = action.payload;

      deletePlaylistItem(draft.entities, playlistId, itemId);

      return draft;
    }

    case ActionTypes.DELETE_PLAYLIST_ITEMS_BY_ID: {
      const { playlistId, itemIds } = action.payload;

      itemIds.forEach((itemId) => {
        deletePlaylistItem(draft.entities, playlistId, itemId);
      });

      return draft;
    }

    case ActionTypes.SYNC_PLAYLIST_FROM_YT_BY_ID: {
      draft.updating = true;
      return draft;
    }

    case ActionTypes.SYNC_PLAYLIST_FROM_YT_BY_ID_SUCCESS: {
      draft.updating = false;
      return draft;
    }

    case ActionTypes.SYNC_PLAYLIST_FROM_YT_BY_ID_FAILED: {
      draft.updating = false;
      return draft;
    }

    case ActionTypes.UPDATE_PLAYLIST_NAME_BY_ID: {
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

    case ActionTypes.ADD_PARTIAL_IN_PLAYING_LABEL_BY_ID: {
      const { id } = action.payload;
      const playlists = draft.entities.playlists;

      if (playlists[id]) playlists[id].partialInPlaying = true;

      return draft;
    }

    case ActionTypes.REMOVE_PARTIAL_IN_PLAYING_LABEL_BY_ID: {
      const { id } = action.payload;
      const playlists = draft.entities.playlists;

      if (playlists[id] && playlists[id].partialInPlaying) {
        playlists[id].partialInPlaying = false;
      }

      return draft;
    }

    case ActionTypes.SHUFFLE_PLAYLIST_ITEMS: {
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
