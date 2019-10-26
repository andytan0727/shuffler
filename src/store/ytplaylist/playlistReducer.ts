import produce, { Draft, original } from "immer";
import shuffle from "lodash/shuffle";
import { Reducer } from "typesafe-actions";
import {
  ADD_ALL_IN_PLAYING_LABEL_BY_ID,
  ADD_PARTIAL_IN_PLAYING_LABEL_BY_ID,
  ADD_PLAYLIST,
  DELETE_PLAYLIST_BY_ID,
  DELETE_PLAYLIST_ITEM_BY_ID,
  DELETE_PLAYLIST_ITEMS_BY_ID,
  REMOVE_ALL_IN_PLAYING_LABEL_BY_ID,
  REMOVE_PARTIAL_IN_PLAYING_LABEL_BY_ID,
  SHUFFLE_PLAYLIST_ITEMS,
  SYNC_PLAYLIST_FROM_YT_BY_ID,
  SYNC_PLAYLIST_FROM_YT_BY_ID_FAILED,
  SYNC_PLAYLIST_FROM_YT_BY_ID_SUCCESS,
  UPDATE_PLAYLIST_NAME_BY_ID,
} from "utils/constants/actionConstants";

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
    case ADD_PLAYLIST: {
      const { entities, result } = action.payload;
      return deepMergeStates(draft, entities, result);
    }

    case DELETE_PLAYLIST_BY_ID: {
      const { id } = action.payload;
      return deletePlaylistOrVideoById(draft, id);
    }

    case DELETE_PLAYLIST_ITEM_BY_ID: {
      const { playlistId, itemId } = action.payload;

      deletePlaylistItem(draft.entities, playlistId, itemId);

      return draft;
    }

    case DELETE_PLAYLIST_ITEMS_BY_ID: {
      const { playlistId, itemIds } = action.payload;

      itemIds.forEach((itemId) => {
        deletePlaylistItem(draft.entities, playlistId, itemId);
      });

      return draft;
    }

    case SYNC_PLAYLIST_FROM_YT_BY_ID: {
      draft.updating = true;
      return draft;
    }

    case SYNC_PLAYLIST_FROM_YT_BY_ID_SUCCESS: {
      draft.updating = false;
      return draft;
    }

    case SYNC_PLAYLIST_FROM_YT_BY_ID_FAILED: {
      draft.updating = false;
      return draft;
    }

    case UPDATE_PLAYLIST_NAME_BY_ID: {
      const { id, name } = action.payload;

      return updatePlaylistOrVideoNameById(draft, {
        id,
        name,
        source: "playlists",
      });
    }

    case ADD_ALL_IN_PLAYING_LABEL_BY_ID: {
      const { id } = action.payload;
      const playlists = draft.entities.playlists;

      if (playlists[id]) playlists[id].allInPlaying = true;

      return draft;
    }

    case REMOVE_ALL_IN_PLAYING_LABEL_BY_ID: {
      const { id } = action.payload;
      const playlists = draft.entities.playlists;

      // if playlist id existed and all its items are in listToPlay previously
      if (playlists[id] && playlists[id].allInPlaying) {
        playlists[id].allInPlaying = false;
      }

      return draft;
    }

    case ADD_PARTIAL_IN_PLAYING_LABEL_BY_ID: {
      const { id } = action.payload;
      const playlists = draft.entities.playlists;

      if (playlists[id]) playlists[id].partialInPlaying = true;

      return draft;
    }

    case REMOVE_PARTIAL_IN_PLAYING_LABEL_BY_ID: {
      const { id } = action.payload;
      const playlists = draft.entities.playlists;

      if (playlists[id] && playlists[id].partialInPlaying) {
        playlists[id].partialInPlaying = false;
      }

      return draft;
    }

    case SHUFFLE_PLAYLIST_ITEMS: {
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
