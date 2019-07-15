import produce, { Draft } from "immer";
import { combineReducers } from "redux";
import { getType, Reducer } from "typesafe-actions";
import merge from "lodash/merge";
import set from "lodash/set";
import get from "lodash/get";
import has from "lodash/has";
import pull from "lodash/pull";
import remove from "lodash/remove";
import shuffle from "lodash/shuffle";
import at from "lodash/at";
import * as ytplaylistAction from "./action";
import {
  NormalizedPlaylistsState,
  MediaItem,
  ListToPlayResultItem,
  NormalizedListToPlayStates,
  NormalizedVideosState,
  PlaylistsEntities,
  NormalizedPlaylistsOrVideosStates,
  PlaylistsOrVideosItemsEntity,
  PlaylistsOrVideosEntities,
  YTPlaylistAction,
} from "./types";

// ==================================================
// Type Guards
// ==================================================
/**
 * Type guard for checking whether the normalized entities provided is playlists'
 *  entities or videos' entities
 *
 * @param entities
 * @returns
 */
export const isPlaylistsEntities = (
  entities: PlaylistsOrVideosEntities
): entities is PlaylistsEntities =>
  (entities as PlaylistsEntities).playlists !== undefined;

// ==================================================
// Util functions
// ==================================================
/**
 * Deep merge normalized entities (and accompanying result array) into
 * existing store states.
 *
 * **Note:** This function mutates draft
 *
 * @param draft Drafted proxy states of store states provided by immer
 * @param action
 * @returns Mutated (drafted) states
 */
const mergeNormalizedEntities = <
  T extends NormalizedPlaylistsOrVideosStates | NormalizedListToPlayStates
>(
  draft: T,
  action: { payload: T }
): T => {
  const { entities, result } = action.payload;

  merge(draft.entities, entities);

  // merge array for both union types
  (draft.result as []).push(...(result as []));

  return draft;
};

/**
 *
 * Updates playlist/video source name by id
 *
 * **Note:** This function mutates draft
 *
 * @param draft Drafted proxy states of store states provided by immer
 * @param mediaItem
 * @returns Mutated draft
 */
const updatePlaylistOrVideoNameById = <
  T extends NormalizedPlaylistsOrVideosStates
>(
  draft: T,
  mediaItem: MediaItem
): T => {
  const { id, name, source } = mediaItem;

  const sourcePath = `entities.${source}.[${id}]`;

  if (has(draft, sourcePath)) set(draft, `${sourcePath}.name`, name);

  return draft;
};

const deleteItemsEntity = (
  itemsEntity: PlaylistsOrVideosItemsEntity,
  itemIds: string[]
) => {
  itemIds.forEach((itemId) => {
    delete itemsEntity[itemId];
  });
};

const deleteSnippetsEntity = (
  entities: PlaylistsOrVideosEntities,
  snippetIds: string[]
) => {
  const snippetsEntity = get(entities, "snippets");

  snippetIds.forEach((snippetId) => {
    delete snippetsEntity[snippetId];
  });
};

/**
 * General method for deleting playlist/video by id
 *
 * **Note:** This function mutates draft
 *
 * @param draft Drafted proxy states of store states provided by immer
 * @param id Playlist/video id to delete
 * @returns Mutated draft
 */
export const deletePlaylistOrVideoById = <
  T extends NormalizedPlaylistsOrVideosStates
>(
  draft: T,
  id: string
): T => {
  const { entities, result } = draft;

  // do nothing if id cannot be found
  if (!result.includes(id)) return draft;

  const sourceEntity = isPlaylistsEntities(entities)
    ? entities.playlists
    : entities.videos;
  const itemsEntity = isPlaylistsEntities(entities)
    ? entities.playlistItems
    : entities.videoItems;

  const itemIds = get(sourceEntity, [id, "items"]);

  // lodash/at unable to resolve snippet's stringify property path of [id].snippet type
  // which is a string array
  // type assertion to generic array as a workaround
  const snippetIds = at(
    itemsEntity,
    itemIds.map((id) => `[${id}].snippet`)
  ) as [];

  // delete related source
  delete sourceEntity[id];

  // delete related playlist/video items
  deleteItemsEntity(itemsEntity, itemIds);

  // delete related snippets
  deleteSnippetsEntity(entities, snippetIds);

  // delete related id in result array
  pull(result, id);

  return draft;
};

/**
 * Delete listToPlay item by itemId given.
 *
 * **Note:** This function mutates draft
 *
 * @param draft Drafted proxy states of store states provided by immer
 * @param id Item id to be deleted
 * @returns
 */
const deleteListToPlayItemById = (
  draft: NormalizedListToPlayStates,
  id: string
): NormalizedListToPlayStates => {
  const [removedItem] = remove(draft.result, (item) => item.id === id);

  // do nothing if item cannot be found
  if (!removedItem) return draft;

  // remove and delete entities if item is found
  delete draft.entities[removedItem.schema][removedItem.id];

  return draft;
};

// ==================================================
// Playlists
// ==================================================
const initialPlaylistsState: NormalizedPlaylistsState = {
  entities: {
    playlistItems: {},
    playlists: {},
    snippets: {},
  },
  result: [],
};

export const playlistsReducer: Reducer<
  NormalizedPlaylistsState,
  YTPlaylistAction
> = produce(
  (draft: Draft<NormalizedPlaylistsState>, action: YTPlaylistAction) => {
    switch (action.type) {
      case getType(ytplaylistAction.addFetchedPlaylistAction): {
        return mergeNormalizedEntities<NormalizedPlaylistsState>(draft, action);
      }

      case getType(ytplaylistAction.deletePlaylistByIdAction): {
        const { id } = action.payload;

        return deletePlaylistOrVideoById(draft, id);
      }

      case getType(ytplaylistAction.updatePlaylistNameByIdAction): {
        const { id, name } = action.payload;

        return updatePlaylistOrVideoNameById(draft, {
          id,
          name,
          source: "playlists",
        });
      }

      // case SET_WHOLE_PLAYLIST_IN_PLAYING_BY_ID: {
      case getType(ytplaylistAction.setWholePlaylistInPlayingByIdAction): {
        const { id } = action.payload;

        if (draft.entities.playlists[id])
          draft.entities.playlists[id].allInPlaying = true;

        return draft;
      }

      default:
        return draft;
    }
  },
  initialPlaylistsState
);

// ==================================================
// Videos
// ==================================================
const initialVideosState: NormalizedVideosState = {
  entities: {
    videoItems: {},
    videos: {},
    snippets: {},
  },
  result: [],
};

export const videosReducer: Reducer<
  NormalizedVideosState,
  YTPlaylistAction
> = produce((draft: Draft<NormalizedVideosState>, action: YTPlaylistAction) => {
  switch (action.type) {
    case getType(ytplaylistAction.addFetchedVideoAction): {
      return mergeNormalizedEntities(draft, action);
    }

    case getType(ytplaylistAction.updateVideoNameByIdAction): {
      const { id, name } = action.payload;

      return updatePlaylistOrVideoNameById(draft, {
        id,
        name,
        source: "videos",
      });
    }

    case getType(ytplaylistAction.deleteVideoByIdAction): {
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
const initialListToPlayState: NormalizedListToPlayStates = {
  entities: {
    playlistItems: {},
    videoItems: {},
  },
  result: [],
};

export const listToPlayReducer: Reducer<
  NormalizedListToPlayStates,
  YTPlaylistAction
> = produce(
  (draft: Draft<NormalizedListToPlayStates>, action: YTPlaylistAction) => {
    switch (action.type) {
      case getType(ytplaylistAction.addListToPlayItemAction): {
        const {
          resultItem: { id, source, schema },
          foreignKey,
        }: {
          resultItem: ListToPlayResultItem;
          foreignKey: string;
        } = action.payload;

        draft.entities[schema][id] = { id, foreignKey };
        draft.result.push({ id, source, schema });
        return draft;
      }

      // for batch addition of items directly through normalized entities and result
      case getType(ytplaylistAction.addListToPlayItemsAction): {
        return mergeNormalizedEntities(draft, action);
      }

      case getType(ytplaylistAction.deleteListToPlayItemByIdAction): {
        return deleteListToPlayItemById(draft, action.payload.id);
      }

      case getType(ytplaylistAction.deleteListToPlayItemsAction): {
        const { ids } = action.payload;

        ids.forEach((id) => {
          deleteListToPlayItemById(draft, id);
        });

        return draft;
      }

      // NOTE: also dispatched on: ytplaylist
      case getType(ytplaylistAction.clearListToPlayAction): {
        draft.entities.playlistItems = {};
        draft.entities.videoItems = {};
        draft.result = [];

        return draft;
      }

      // NOTE: also dispatched on: ytplaylist
      case getType(ytplaylistAction.shuffleListToPlayAction): {
        draft.result = shuffle(draft.result);
        return draft;
      }

      default:
        return draft;
    }
  },
  initialListToPlayState
);

export const ytplaylistNormalized = combineReducers({
  playlists: playlistsReducer,
  videos: videosReducer,
  listToPlay: listToPlayReducer,
});
