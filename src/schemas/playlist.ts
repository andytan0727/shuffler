import { denormalize, normalize, NormalizedSchema, schema } from "normalizr";
import { FetchedPlaylist, PlaylistsEntities } from "store/ytplaylist/types";
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
  originalPlaylists: DeepReadonly<FetchedPlaylist[]>
) =>
  normalize<typeof originalPlaylists, PlaylistsEntities, string[]>(
    originalPlaylists,
    playlistSchema
  );

export const denormalizePlaylists = (
  normalizedPlaylists: NormalizedSchema<PlaylistsEntities, string[]>
) =>
  denormalize(
    normalizedPlaylists.result,
    playlistSchema,
    normalizedPlaylists.entities
  );
