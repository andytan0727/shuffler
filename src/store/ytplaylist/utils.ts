import merge from "lodash/merge";
import set from "lodash/set";
import get from "lodash/get";
import has from "lodash/has";
import pull from "lodash/pull";
import remove from "lodash/remove";
import at from "lodash/at";
import {
  MediaItem,
  NormListToPlay,
  NormPlaylistsEntities,
  NormPlaylistsOrVideos,
  NormPlaylistsOrVideosItemsEntity,
  NormPlaylistsOrVideosEntities,
} from "./types";

// ==================================================
// Type Guards
// ==================================================
/**
 * Type guard for checking whether the normalized entities provided is playlists'
 * entities or videos' entities
 *
 * @param entities
 * @returns
 */
export const isPlaylistsEntities = (
  entities: NormPlaylistsOrVideosEntities
): entities is NormPlaylistsEntities =>
  (entities as NormPlaylistsEntities).playlists !== undefined;

// ==================================================
// Util functions
// ==================================================
/**
 * Deep merge normalized entities (and accompanying result array) into
 * existing store states.
 *
 * **_Note: This function mutates draft_**
 *
 * @param draft Drafted proxy states of store states provided by immer
 * @param action
 * @returns Mutated (drafted) states
 */
export const mergeNormalizedEntities = <
  T extends NormPlaylistsOrVideos | NormListToPlay
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
 * **_Note: This function mutates draft_**
 *
 * @param draft Drafted proxy states of store states provided by immer
 * @param mediaItem
 * @returns Mutated draft
 */
export const updatePlaylistOrVideoNameById = <T extends NormPlaylistsOrVideos>(
  draft: T,
  mediaItem: MediaItem
): T => {
  const { id, name, source } = mediaItem;

  const sourcePath = `entities.${source}.[${id}]`;

  if (has(draft, sourcePath)) set(draft, `${sourcePath}.name`, name);

  return draft;
};

export const deleteItemsEntity = (
  itemsEntity: NormPlaylistsOrVideosItemsEntity,
  itemIds: string[]
) => {
  itemIds.forEach((itemId) => {
    delete itemsEntity[itemId];
  });
};

export const deleteSnippetsEntity = (
  entities: NormPlaylistsOrVideosEntities,
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
 * **_Note: This function mutates draft_**
 *
 * @param draft Drafted proxy states of store states provided by immer
 * @param id Playlist/video id to delete
 * @returns Mutated draft
 */
export const deletePlaylistOrVideoById = <T extends NormPlaylistsOrVideos>(
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
 * **_Note: This function mutates draft_**
 *
 * @param draft Drafted proxy states of store states provided by immer
 * @param id Item id to be deleted
 * @returns
 */
export const deleteListToPlayItemById = (
  draft: NormListToPlay,
  id: string
): NormListToPlay => {
  const [removedItem] = remove(draft.result, (item) => item.id === id);

  // do nothing if item cannot be found
  if (!removedItem) return draft;

  // remove and delete entities if item is found
  delete draft.entities[removedItem.schema][removedItem.id];

  return draft;
};

// =====================================================
// Utils for selectors
// =====================================================
export const getSnippetFromItemId = (
  entities: NormPlaylistsOrVideosEntities,
  itemId: string
) => {
  const snippetId = isPlaylistsEntities(entities)
    ? get(entities.playlistItems[itemId], "snippet", "Id Not Found")
    : get(entities.videoItems[itemId], "snippet", "Id Not Found");

  // assign snippet's key as the id of the returning object
  // for the usage in views
  return {
    ...entities.snippets[snippetId],
    id: snippetId,
  };
};
