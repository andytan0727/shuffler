import { FuseOptions } from "fuse.js";
import { ActionType } from "typesafe-actions";
import { DeepReadonly } from "utility-types";

import * as ytplaylistNormedAction from "./normAction";

export interface MediaItem {
  id: string;
  name: string;
  source: MediaSourceType;
}

export interface VideoThumbnails {
  default: VideoThumbnailsProperties;
  medium: VideoThumbnailsProperties;
  standard: VideoThumbnailsProperties;
  high: VideoThumbnailsProperties;
  maxres?: VideoThumbnailsProperties;
}

export interface VideoThumbnailsProperties {
  height: number;
  url: string;
  width: number;
}

// =====================================================
// Playlists
// =====================================================
export interface Playlist {
  id: string;
  name?: string;
  nextPageToken?: string;
  items: PlaylistItem[];
}

export interface PlaylistItem extends BaseItemsEntity {
  snippet: PlaylistItemSnippet;
}

export interface PlaylistItemSnippet {
  id?: string;
  channelId: string;
  channelTitle: string;
  description: string;
  playlistId: string;
  position: number;
  publishedAt: string;
  title: string;
  resourceId: { kind: string; videoId: string };
  thumbnails?: VideoThumbnails;

  // for the usage in filtered snippets in filtered redux states
  itemId?: string;
}

export interface NormPlaylistItemsEntity {
  [key: string]: {
    snippet: string;
  } & BaseItemsEntity;
}

export interface NormPlaylistsSourceEntity {
  [key: string]: {
    name?: string;
    allInPlaying?: boolean;
  } & BaseSourceEntity;
}

export interface NormPlaylistsSnippetsEntity {
  [key: string]: PlaylistItemSnippet;
}

export interface NormPlaylistsEntities {
  playlistItems: NormPlaylistItemsEntity;
  playlists: NormPlaylistsSourceEntity;
  snippets: NormPlaylistsSnippetsEntity;
}

export interface NormPlaylists {
  entities: NormPlaylistsEntities;
  result: string[];
}

export type DeepRONormPlaylists = DeepReadonly<NormPlaylists>;

// =====================================================
// Videos
// =====================================================
export interface Video {
  id: string;
  items: VideoItem[];
}

export interface VideoItem extends BaseItemsEntity {
  snippet: VideoItemSnippet;
}

export interface VideoItemSnippet {
  id?: string;
  categoryId: string;
  channelId: string;
  channelTitle: string;
  description: string;
  liveBroadcastContent: string;
  publishedAt: string;
  tags: string[];
  thumbnails?: VideoThumbnails;
  title: string;
  localized: { title: string; description: string };

  // for the usage in filtered snippets in filtered redux states
  itemId?: string;
}

export interface NormVideoItemsEntity {
  [key: string]: {
    snippet: string;
  } & BaseItemsEntity;
}

export interface NormVideosSourceEntity {
  [key: string]: BaseSourceEntity;
}

export interface NormVideosSnippetsEntity {
  [key: string]: VideoItemSnippet;
}

export interface NormVideosEntities {
  videoItems: NormVideoItemsEntity;
  videos: NormVideosSourceEntity;
  snippets: NormVideosSnippetsEntity;
}

export interface NormVideos {
  entities: NormVideosEntities;
  result: string[];
}

export type DeepRONormVideos = DeepReadonly<NormVideos>;

// grouped normalized playlists/videos union type exports
export type NormPlaylistsOrVideos = NormPlaylists | NormVideos;
export type NormPlaylistsOrVideosEntities =
  | NormPlaylistsEntities
  | NormVideosEntities;
export type NormPlaylistsOrVideosItemsEntity =
  | NormPlaylistItemsEntity
  | NormVideoItemsEntity;

// ====================================================
// List To Play
// ====================================================
export interface NormListToPlayMediaSourceItem {
  id: string;
  foreignKey: string;
}

export interface NormListToPlayPlaylistItemsEntity {
  [key: string]: NormListToPlayMediaSourceItem;
}

export interface NormListToPlayVideoItemsEntity {
  [key: string]: NormListToPlayMediaSourceItem;
}

export interface NormListToPlayEntities {
  playlistItems: NormListToPlayPlaylistItemsEntity;
  videoItems: NormListToPlayVideoItemsEntity;
}

export interface NormListToPlayResultItem {
  id: string;
  schema: SchemaType;
}

export interface NormListToPlay {
  entities: NormListToPlayEntities;
  result: NormListToPlayResultItem[];
}

export type DeepRONormListToPlay = DeepReadonly<NormListToPlay>;

// ====================================================
// Filtered
// ====================================================
export interface Filtered {
  fuse: Fuse<PlaylistItemSnippet | VideoItemSnippet> | undefined;
  options: FuseOptions<PlaylistItemSnippet | VideoItemSnippet>;
  snippets: (PlaylistItemSnippet | VideoItemSnippet)[] | undefined;
}

export type DeepROFiltered = DeepReadonly<Filtered>;
// ====================================================
// End Filtered
// ====================================================

export interface YTPlaylistNormedState {
  playlists: DeepRONormPlaylists;
  videos: DeepRONormVideos;
  listToPlay: DeepRONormListToPlay;
  filtered: Filtered;
}

export type ListToPlayItems = DeepReadonly<(PlaylistItem | VideoItem)[]>;
export type ListToPlaySnippets = DeepReadonly<
  (PlaylistItemSnippet | VideoItemSnippet)[]
>;

// ==================================================
// Actions
// ==================================================
export type YTPlaylistNormedAction = ActionType<typeof ytplaylistNormedAction>;
