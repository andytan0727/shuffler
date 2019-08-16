import produce, { Draft, original } from "immer";
import shuffle from "lodash/shuffle";
import uniq from "lodash/uniq";
import { Reducer } from "typesafe-actions";
import * as ActionTypes from "utils/constants/actionConstants";

import {
  DeepRONormPlaylists,
  NormPlaylists,
  YTPlaylistNormedAction,
} from "./types";
import {
  deletePlaylistOrVideoById,
  mergeNormalizedEntities,
  updatePlaylistOrVideoNameById,
} from "./utils";

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