import { schema, normalize, denormalize, NormalizedSchema } from "normalizr";
import { Playlist, NormPlaylistsEntities } from "store/ytplaylist/types";
import { DeepReadonly } from "utility-types";

export const playlistItemSnippetSchema = new schema.Entity(
  "snippets",
  {},
  {
    idAttribute: (input) => input.resourceId.videoId,
  }
);

export const playlistItemSchema = new schema.Entity("playlistItems", {
  snippet: playlistItemSnippetSchema,
});

export const playlistItemsSchema = new schema.Entity("playlists", {
  items: [playlistItemSchema],
});

export const playlistSchema = new schema.Array(playlistItemsSchema);

export const normalizePlaylists = (
  originalPlaylists: DeepReadonly<Playlist[]>
) =>
  normalize<NormPlaylistsEntities, string[]>(originalPlaylists, playlistSchema);

export const denormalizePlaylists = (
  normalizedPlaylists: NormalizedSchema<NormPlaylistsEntities, string[]>
) =>
  denormalize(
    normalizedPlaylists.result,
    playlistSchema,
    normalizedPlaylists.entities
  );
