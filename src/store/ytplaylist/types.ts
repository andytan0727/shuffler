import * as ytplaylistAction from "./action";
import { ActionType } from "typesafe-actions";

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
  thumbnails: VideoThumbnails;
}

export interface PlaylistsEntities {
  playlistItems: PlaylistItemsEntity;
  playlists: PlaylistsSourceEntity;
  snippets: PlaylistsSnippetsEntity;
}

export interface PlaylistItemsEntity {
  [key: string]: {
    snippet: string;
  } & BaseItemsEntity;
}

export interface PlaylistsSourceEntity {
  [key: string]: {
    name?: string;
    allInPlaying?: boolean;
  } & BaseSourceEntity;
}

export interface PlaylistsSnippetsEntity {
  [key: string]: PlaylistItemSnippet;
}

export interface NormalizedPlaylistsState {
  entities: PlaylistsEntities;
  result: string[];
}

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
  thumbnails: VideoThumbnails[];
  title: string;
  localized: { title: string; description: string };
}

export interface NormalizedVideosState {
  entities: VideosEntities;
  result: string[];
}

export interface VideosEntities {
  videoItems: VideoItemsEntity;
  videos: VideosSourceEntity;
  snippets: VideosSnippetsEntity;
}

export interface VideoItemsEntity {
  [key: string]: {
    snippet: string;
  } & BaseItemsEntity;
}

export interface VideosSourceEntity {
  [key: string]: BaseSourceEntity;
}

export interface VideosSnippetsEntity {
  [key: string]: VideoItemSnippet;
}

export type NormalizedPlaylistsOrVideosStates =
  | NormalizedPlaylistsState
  | NormalizedVideosState;
export type PlaylistsOrVideosEntities = PlaylistsEntities | VideosEntities;
export type PlaylistsOrVideosItemsEntity =
  | PlaylistItemsEntity
  | VideoItemsEntity;

export interface ListToPlayResultItem {
  id: string;
  source: MediaSourceType;
  schema: SchemaType;
}

export interface ListToPlayMediaSourceItem {
  id: string;
  foreignKey: string;
}

export interface ListToPlayVideoItemsEntity {
  [key: string]: ListToPlayMediaSourceItem;
}

export interface ListToPlayPlaylistItemsEntity {
  [key: string]: ListToPlayMediaSourceItem;
}

export interface ListToPlayEntities {
  playlistItems: ListToPlayPlaylistItemsEntity;
  videoItems: ListToPlayVideoItemsEntity;
}

export interface NormalizedListToPlayStates {
  entities: ListToPlayEntities;
  result: ListToPlayResultItem[];
}

// ==================================================
// Actions
// ==================================================
export type YTPlaylistAction = ActionType<typeof ytplaylistAction>;
