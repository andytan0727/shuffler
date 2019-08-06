import { ActionType } from "typesafe-actions";
import { DeepReadonly } from "utility-types";

import * as ytplaylistAction from "./action";
import * as ytplaylistNormedAction from "./normAction";
import * as sharedAction from "./sharedAction";

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

export interface YTPlaylistState {
  checkedPlaylists: string[];
  checkedVideos: string[];
  playlists: Playlist[];
  videos: Video[];
  listToPlay: (PlaylistItem | VideoItem)[];
  playingPlaylists: string[];
  playingVideos: string[];
}

export type DeepROYtPlaylistState = DeepReadonly<YTPlaylistState>;

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
  thumbnails: VideoThumbnails;
  title: string;
  localized: { title: string; description: string };
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
  source: MediaSourceType;
  schema: SchemaType;
}

export interface NormListToPlay {
  entities: NormListToPlayEntities;
  result: NormListToPlayResultItem[];
}

export type DeepRONormListToPlay = DeepReadonly<NormListToPlay>;

export interface YTPlaylistNormedState {
  playlists: DeepRONormPlaylists;
  videos: DeepRONormVideos;
  listToPlay: DeepRONormListToPlay;
}

export type ListToPlayItems = DeepReadonly<(PlaylistItem | VideoItem)[]>;

// ==================================================
// Actions
// ==================================================
type SharedAction = ActionType<typeof sharedAction>;
export type YTPlaylistAction =
  | ActionType<typeof ytplaylistAction>
  | SharedAction;
export type YTPlaylistNormedAction =
  | ActionType<typeof ytplaylistNormedAction>
  | SharedAction;
