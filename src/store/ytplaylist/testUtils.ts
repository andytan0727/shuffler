import produce from "immer";
import get from "lodash/get";

import {
  NormPlaylists,
  NormPlaylistsEntities,
  NormVideos,
  NormVideosEntities,
  PlaylistItemSnippet,
} from "./types";
import { isPlaylistsEntities } from "./utils";

/**
 * **Note:** This function mutates entities
 *
 * @param entities Video entities to add states
 * @param videoId Dummy id to assign
 */
function makeVideosEntitiesState(
  entities: NormVideosEntities,
  videoId: number,
  itemsLength?: number
) {
  const itemIds = itemsLength
    ? Array.from({ length: itemsLength }, (_, idx) => idx + 1)
    : [];

  return produce(entities, (draftEntities) => {
    const video = {
      id: `videoId-${videoId}`,
      items: itemsLength
        ? itemIds.map((itemId) => `itemId-${videoId}-${itemId}`)
        : [`itemId-${videoId}-1`],
    };

    draftEntities.videos[`videoId-${videoId}`] = video;

    for (const itemId of itemIds) {
      const videoItem: {
        snippet: string;
      } & BaseItemsEntity = {
        id: `itemId-${videoId}-${itemId}`,
        kind: "youtube#video",
        etag: "randomString",
        snippet: `snippetId-${videoId}-${itemId}`,
      };
      const snippet = {
        categoryId: `categoryId-${videoId}-${itemId}`,
        title: `title-${videoId}-${itemId}`,
        channelId: `channelId-${videoId}-${itemId}`,
        channelTitle: `channelTitle-${videoId}-${itemId}`,
        description: `description-${videoId}-${itemId}`,
        liveBroadcastContent: `broadcast-${videoId}-${itemId}`,
        publishedAt: `published-${videoId}-${itemId}`,
        tags: [`tag-${videoId}-${itemId}`],
        thumbnails: {
          default: {
            height: itemId,
            width: itemId,
            url: `url-${videoId}-${itemId}`,
          },
          medium: {
            height: itemId,
            width: itemId,
            url: `url-${videoId}-${itemId}`,
          },
          standard: {
            height: itemId,
            width: itemId,
            url: `url-${videoId}-${itemId}`,
          },
          high: {
            height: itemId,
            width: itemId,
            url: `url-${videoId}-${itemId}`,
          },
          maxres: {
            height: itemId,
            width: itemId,
            url: `url-${videoId}-${itemId}`,
          },
        },
        localized: {
          title: `test-${videoId}-${itemId}`,
          description: `test-${videoId}-${itemId}`,
        },
        itemId: itemId.toString(),
      };

      draftEntities.videoItems[`itemId-${videoId}-${itemId}`] = videoItem;

      draftEntities.snippets[`snippetId-${videoId}-${itemId}`] = snippet;
    }
  });
}

function makePlaylistsEntitiesStates(
  entities: NormPlaylistsEntities,
  playlistId: number,
  itemsLength?: number
) {
  const itemIds = itemsLength
    ? Array.from({ length: itemsLength }, (_, idx) => idx + 1)
    : [];

  return produce(entities, (draftEntities) => {
    const playlist = {
      id: `playlistId-${playlistId}`,
      items: itemsLength
        ? itemIds.map((itemId) => `itemId-${playlistId}-${itemId}`)
        : [`itemId-${playlistId}-1`],
    };

    // setup playlist
    draftEntities.playlists[`playlistId-${playlistId}`] = playlist;

    for (const itemId of itemIds) {
      const playlistItem: {
        snippet: string;
      } & BaseItemsEntity = {
        id: `itemId-${playlistId}-${itemId}`,
        kind: "youtube#playlistItem",
        etag: "randomString",
        snippet: `snippetId-${playlistId}-${itemId}`,
      };
      const snippet: PlaylistItemSnippet = {
        playlistId: `playlistId-${playlistId}`,
        channelId: `channelId-${playlistId}-${itemId}`,
        channelTitle: `channelTitle-${playlistId}-${itemId}`,
        description: `description-${playlistId}-${itemId}`,
        position: playlistId * itemId,
        publishedAt: `published-${playlistId}-${itemId}`,
        thumbnails: {
          default: {
            height: itemId,
            width: itemId,
            url: `url-${playlistId}-${itemId}`,
          },
          medium: {
            height: itemId,
            width: itemId,
            url: `url-${playlistId}-${itemId}`,
          },
          standard: {
            height: itemId,
            width: itemId,
            url: `url-${playlistId}-${itemId}`,
          },
          high: {
            height: itemId,
            width: itemId,
            url: `url-${playlistId}-${itemId}`,
          },
          maxres: {
            height: itemId,
            width: itemId,
            url: `url-${playlistId}-${itemId}`,
          },
        },
        resourceId: {
          kind: "youtube#video",
          videoId: `videoId-${playlistId}-${itemId}`,
        },
        title: `title-${playlistId}-${itemId}`,
      };

      // setup playlistItems
      draftEntities.playlistItems[
        `itemId-${playlistId}-${itemId}`
      ] = playlistItem;

      // setup snippets
      draftEntities.snippets[`snippetId-${playlistId}-${itemId}`] = snippet;
    }
  });
}

/**
 *
 * @param states
 * @param idxToExclude
 * @returns Mutated states
 */
export function stateMaker(
  states: NormPlaylists | NormVideos,
  customizer?: {
    sourceLength?: number;
    itemsLength?: number;
    excludeId?: number;
  }
): NormPlaylists | NormVideos {
  const sourceLength = get(customizer, "sourceLength");
  const itemsLength = get(customizer, "itemsLength");
  const excludeId = get(customizer, "excludeId");

  return produce(states, (draft) => {
    Array.from({ length: sourceLength || 10 }, (_, idx) => idx + 1).forEach(
      (val) => {
        if (excludeId && excludeId === val) return;

        const entities = draft.entities;
        const result = draft.result;

        if (isPlaylistsEntities(entities)) {
          draft.entities = makePlaylistsEntitiesStates(
            entities,
            val,
            itemsLength
          );
          result.push(`playlistId-${val}`);
        } else {
          draft.entities = makeVideosEntitiesState(entities, val, itemsLength);
          result.push(`videoId-${val}`);
        }
      }
    );
  });
}
