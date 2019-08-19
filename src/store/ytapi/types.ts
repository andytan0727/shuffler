import { FetchedPlaylist, FetchedVideo } from "store/ytplaylist/types";
import { ActionType } from "typesafe-actions";

import * as ytapiAction from "./action";

export interface YTAPIState {
  apiKey: string;
  playlistUrl: string;
  playlistItems: YTAPIPlaylistItems;
  videoUrl: string;
  videos: YTAPIVideoItems;
  fetchedPlaylistId: string[];
  fetchedVideoId: string[];
}

export interface YTAPIPlaylistItems {
  apiBaseUrl: string;
  options: YTAPIParamOptions;
  fetchedData: FetchedPlaylist[];
  fetchLoading: boolean;
}

export interface YTAPIVideoItems {
  apiBaseUrl: string;
  options: YTAPIParamOptions;
  fetchedData: FetchedVideo[];
  fetchLoading: boolean;
}

export interface YTAPIParamOptions {
  part: string;
  maxResults: string;
  playlistId?: string;
  id?: string;
  fields: string[];
}

export type YTAPIAction = ActionType<typeof ytapiAction>;
