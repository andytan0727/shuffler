import { FuseOptions } from "fuse.js";
import { ActionType } from "typesafe-actions";
import { DeepReadonly } from "utility-types";

import * as filteredActions from "./filteredActions";
import * as listToPlayActions from "./listToPlayActions";
import * as playlistActions from "./playlistActions";
import * as videoActions from "./videoActions";

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
export interface FetchedPlaylist {
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

export interface PlaylistItemsEntity {
  [key: string]: {
    snippet: string;
  } & BaseItemsEntity;
}

export interface PlaylistsEntity {
  [key: string]: PlaylistsEntityItem;
}

export interface PlaylistsEntityItem extends BaseSourceEntity {
  name?: string;
  allInPlaying?: boolean;
  partialInPlaying?: boolean;
}

export interface PlaylistSnippetsEntity {
  [key: string]: PlaylistItemSnippet;
}

export interface PlaylistsEntities {
  playlistItems: PlaylistItemsEntity;
  playlists: PlaylistsEntity;
  snippets: PlaylistSnippetsEntity;
}

export interface Playlists {
  entities: PlaylistsEntities;
  result: string[];
}

export type DeepReadonlyPlaylists = DeepReadonly<Playlists>;

// =====================================================
// Videos
// =====================================================
export interface FetchedVideo {
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

export interface VideoItemsEntity {
  [key: string]: {
    snippet: string;
  } & BaseItemsEntity;
}

export interface VideosEntity {
  [key: string]: BaseSourceEntity;
}

export interface VideosSnippetsEntity {
  [key: string]: VideoItemSnippet;
}

export interface VideosEntities {
  videoItems: VideoItemsEntity;
  videos: VideosEntity;
  snippets: VideosSnippetsEntity;
}

export interface Videos {
  entities: VideosEntities;
  result: string[];
}

export type DeepReadonlyVideos = DeepReadonly<Videos>;

// grouped playlists/videos union type exports
export type PlaylistsOrVideos = Playlists | Videos;
export type PlaylistsOrVideosEntities = PlaylistsEntities | VideosEntities;
export type PlaylistsOrVideosItemsEntity =
  | PlaylistItemsEntity
  | VideoItemsEntity;

// ====================================================
// List To Play
// ====================================================
export interface ListToPlayItemEntity {
  id: string;
  foreignKey: string;
}

export interface ListToPlayPlaylistItemsEntity {
  [key: string]: ListToPlayItemEntity;
}

export interface ListToPlayVideoItemsEntity {
  [key: string]: ListToPlayItemEntity;
}

export interface ListToPlayEntities {
  playlistItems: ListToPlayPlaylistItemsEntity;
  videoItems: ListToPlayVideoItemsEntity;
}

export interface ListToPlayResultItem {
  id: string;
  schema: SchemaType;
}

export interface ListToPlay {
  entities: ListToPlayEntities;
  result: ListToPlayResultItem[];
}

export type ListToPlaySnippet = PlaylistItemSnippet | VideoItemSnippet;
export type ListToPlaySnippets = ListToPlaySnippet[];
export type ListToPlayItems = (PlaylistItem | VideoItem)[];

export type DeepReadonlyListToPlay = DeepReadonly<ListToPlay>;

// ====================================================
// Filtered
// ====================================================
export interface Filtered {
  fuse: Fuse<PlaylistItemSnippet | VideoItemSnippet> | undefined;
  options: FuseOptions<ListToPlaySnippet>;
  snippets: ListToPlaySnippets | undefined;
}

export type DeepReadonlyFiltered = DeepReadonly<Filtered>;
// ====================================================
// End Filtered
// ====================================================

export interface YTPlaylistState {
  playlists: DeepReadonlyPlaylists;
  videos: DeepReadonlyVideos;
  listToPlay: DeepReadonlyListToPlay;
  filtered: DeepReadonlyFiltered;
}

// ==================================================
// Actions
// ==================================================
export type PlaylistActions = ActionType<typeof playlistActions>;
export type VideoActions = ActionType<typeof videoActions>;
export type ListToPlayActions = ActionType<typeof listToPlayActions>;
export type FilteredActions = ActionType<typeof filteredActions>;
export type YTPlaylistActions =
  | PlaylistActions
  | VideoActions
  | ListToPlayActions
  | FilteredActions;
