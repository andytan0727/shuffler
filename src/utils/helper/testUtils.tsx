import produce from "immer";
import {
  PlaylistItemSnippet,
  Playlists,
  PlaylistsEntities,
  PlaylistsEntityItem,
  VideoItemSnippet,
  Videos,
  VideosEntities,
} from "store/ytplaylist/types";
import { isPlaylistsEntities } from "store/ytplaylist/utils";

// ===================================
// Internal helpers
// ===================================
const makeItem = (
  sourceId: number,
  itemId: number,
  kind: "youtube#playlistItem" | "youtube#video"
) => ({
  id: `itemId-${sourceId}-${itemId}`,
  kind,
  snippet: `snippetId-${sourceId}-${itemId}`,
});

const makeSnippet = (sourceId: number, itemId: number) => ({
  title: `title-${sourceId}-${itemId}`,
  thumbnails: {
    default: {
      height: itemId,
      width: itemId,
      url: `url-${sourceId}-${itemId}`,
    },
    medium: {
      height: itemId,
      width: itemId,
      url: `url-${sourceId}-${itemId}`,
    },
    standard: {
      height: itemId,
      width: itemId,
      url: `url-${sourceId}-${itemId}`,
    },
    high: {
      height: itemId,
      width: itemId,
      url: `url-${sourceId}-${itemId}`,
    },
    maxres: {
      height: itemId,
      width: itemId,
      url: `url-${sourceId}-${itemId}`,
    },
  },

  itemId: itemId.toString(),
});
// ===================================
// End Internal helpers
// ===================================

// ===================================
// Playlists states maker
// ===================================
export const makePlaylistItem = (playlistId: number, itemId: number) =>
  makeItem(playlistId, itemId, "youtube#playlistItem");

export const makeVideoItem = (videoId: number, itemId: number) =>
  makeItem(videoId, itemId, "youtube#video");

export const makePlaylistSnippet = (
  playlistId: number,
  itemId: number
): PlaylistItemSnippet => {
  const snippet = makeSnippet(playlistId, itemId);

  return {
    ...snippet,
    playlistId: `playlistId-${playlistId}`,
    resourceId: {
      kind: "youtube#video",
      videoId: `videoId-${playlistId}-${itemId}`,
    },
  };
};

export const makeVideoSnippet = (
  videoId: number,
  itemId: number
): VideoItemSnippet => makeSnippet(videoId, itemId);

export const makePlaylist = (
  playlistId: number,
  itemIds: number[]
): PlaylistsEntityItem => {
  const itemsLength = itemIds.length;

  return {
    id: `playlistId-${playlistId}`,
    items: itemsLength
      ? itemIds.map((itemId) => `itemId-${playlistId}-${itemId}`)
      : [`itemId-${playlistId}-1`],
  };
};

export const makeVideo = (
  videoId: number,
  itemIds: number[]
): BaseSourceEntity => {
  const itemsLength = itemIds.length;

  return {
    id: `videoId-${videoId}`,
    items: itemsLength
      ? itemIds.map((itemId) => `itemId-${videoId}-${itemId}`)
      : [`itemId-${videoId}-1`],
  };
};

/**
 * **Note:** This function mutates entities
 *
 * @param entities Video entities to add states
 * @param videoId Dummy id to assign
 */
export const makeVideosEntities = (
  entities: VideosEntities,
  videoId: number,
  itemsLength?: number
) => {
  const itemIds = itemsLength
    ? Array.from({ length: itemsLength }, (_, idx) => idx + 1)
    : [];

  return produce(entities, (draftEntities) => {
    draftEntities.videos[`videoId-${videoId}`] = makeVideo(videoId, itemIds);

    for (const itemId of itemIds) {
      draftEntities.videoItems[`itemId-${videoId}-${itemId}`] = makeVideoItem(
        videoId,
        itemId
      );

      draftEntities.snippets[
        `snippetId-${videoId}-${itemId}`
      ] = makeVideoSnippet(videoId, itemId);
    }
  });
};

export const makePlaylistsEntities = (
  entities: PlaylistsEntities,
  playlistId: number,
  itemsLength?: number
) => {
  const itemIds = itemsLength
    ? Array.from({ length: itemsLength }, (_, idx) => idx + 1)
    : [];

  return produce(entities, (draftEntities) => {
    draftEntities.playlists[`playlistId-${playlistId}`] = makePlaylist(
      playlistId,
      itemIds
    );

    for (const itemId of itemIds) {
      draftEntities.playlistItems[
        `itemId-${playlistId}-${itemId}`
      ] = makePlaylistItem(playlistId, itemId);

      draftEntities.snippets[
        `snippetId-${playlistId}-${itemId}`
      ] = makePlaylistSnippet(playlistId, itemId);
    }
  });
};

/**
 *
 * @param states
 * @param idxToExclude
 * @returns Mutated states
 */
export const stateMaker = (
  states: Playlists | Videos,
  customizer?: {
    sourceLength?: number;
    itemsLength?: number;
    excludeId?: number;
  }
): Playlists | Videos => {
  const sourceLength = customizer?.sourceLength;
  const itemsLength = customizer?.itemsLength;
  const excludeId = customizer?.excludeId;

  return produce(states, (draft) => {
    Array.from({ length: sourceLength || 10 }, (_, idx) => idx + 1).forEach(
      (val) => {
        if (excludeId && excludeId === val) return;

        const entities = draft.entities;
        const result = draft.result;

        if (isPlaylistsEntities(entities)) {
          draft.entities = makePlaylistsEntities(entities, val, itemsLength);
          result.push(`playlistId-${val}`);
        } else {
          draft.entities = makeVideosEntities(entities, val, itemsLength);
          result.push(`videoId-${val}`);
        }
      }
    );
  });
};

export const makeListToPlaySnippets = (itemLength?: number) =>
  Array.from({ length: itemLength || 10 }, (_, idx) => idx + 1).map((val) =>
    Math.random() > 0.5
      ? makePlaylistSnippet(val, val)
      : makeVideoSnippet(val, val)
  );
