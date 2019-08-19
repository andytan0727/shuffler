import { denormalize, normalize, NormalizedSchema, schema } from "normalizr";
import {
  FetchedVideo,
  ListToPlayEntities,
  ListToPlayResultItem,
  PlaylistItem,
  VideoItem,
} from "store/ytplaylist/types";
import { DeepReadonly } from "utility-types";

const listToPlayVideoItem = new schema.Entity(
  "videoItems",
  {},
  {
    processStrategy: (entity: FetchedVideo) => {
      const id = entity["id"];
      return {
        id,
        foreignKey: id,
      };
    },
  }
);

const listToPlayPlaylistItem = new schema.Entity(
  "playlistItems",
  {},
  {
    processStrategy: (entity: PlaylistItem) => {
      const {
        id,
        snippet: { playlistId },
      } = entity;

      return {
        id,
        foreignKey: playlistId,
      };
    },
  }
);

export const listToPlayItemSchema = new schema.Array(
  {
    playlistItems: listToPlayPlaylistItem,
    videoItems: listToPlayVideoItem,
  },
  (input) =>
    input.kind === "youtube#playlistItem" ? "playlistItems" : "videoItems"
);

export const normalizeListToPlay = (
  originalListToPlay: DeepReadonly<(PlaylistItem | VideoItem)[]>
) =>
  normalize<ListToPlayEntities, ListToPlayResultItem[]>(
    originalListToPlay,
    listToPlayItemSchema
  );

export const denormalizeListToPlay = (
  normalizedListToPlay: NormalizedSchema<
    ListToPlayEntities,
    ListToPlayResultItem
  >
) =>
  denormalize(
    normalizedListToPlay.result,
    listToPlayItemSchema,
    normalizedListToPlay.entities
  );
