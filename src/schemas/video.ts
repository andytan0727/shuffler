import { normalize, schema } from "normalizr";
import { Video } from "store/ytplaylist/types";
import { DeepReadonly } from "utility-types";

export const videoItemSnippetSchema = new schema.Entity(
  "snippets",
  {},
  {
    idAttribute: (_, parent) => parent.id,
  }
);

export const videoItemSchema = new schema.Entity("videoItems", {
  snippet: videoItemSnippetSchema,
});

export const videoItemsSchema = new schema.Entity("videos", {
  items: [videoItemSchema],
});

export const videosSchema = new schema.Array(videoItemsSchema);

export const normalizeVideos = (originalVideos: DeepReadonly<Video[]>) =>
  normalize(originalVideos, videosSchema);
