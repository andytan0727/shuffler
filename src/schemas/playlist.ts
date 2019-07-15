import { schema, normalize, denormalize, NormalizedSchema } from "normalizr";
import { Playlist, PlaylistsEntities } from "store/ytplaylist/types";

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

export const normalizePlaylists = (originalPlaylists: Playlist[]) =>
  normalize(originalPlaylists, playlistSchema);

export const denormalizePlaylists = (
  normalizedPlaylists: NormalizedSchema<PlaylistsEntities, string[]>
) =>
  denormalize(
    normalizedPlaylists.result,
    playlistSchema,
    normalizedPlaylists.entities
  );
