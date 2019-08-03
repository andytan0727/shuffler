import { denormalize, normalize, NormalizedSchema, schema } from "normalizr";
import {
  NormListToPlayEntities,
  NormListToPlayResultItem,
  PlaylistItem,
  Video,
  VideoItem,
} from "store/ytplaylist/types";
import { DeepReadonly } from "utility-types";

const listToPlayVideoItem = new schema.Entity(
  "videoItems",
  {},
  {
    processStrategy: (entity: Video) => {
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
  normalize<NormListToPlayEntities, NormListToPlayResultItem[]>(
    originalListToPlay,
    listToPlayItemSchema
  );

export const denormalizeListToPlay = (
  normalizedListToPlay: NormalizedSchema<
    NormListToPlayEntities,
    NormListToPlayResultItem
  >
) =>
  denormalize(
    normalizedListToPlay.result,
    listToPlayItemSchema,
    normalizedListToPlay.entities
  );
