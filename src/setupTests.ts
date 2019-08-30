// this adds jest-dom's custom assertions
import "@testing-library/jest-dom/extend-expect";

import deepFreeze from "deep-freeze";
import {
  FetchedPlaylist,
  FetchedVideo,
  ListToPlay,
  PlaylistItem,
  Playlists,
  VideoItem,
  Videos,
} from "store/ytplaylist/types";
import {
  makePlaylistSnippet,
  makeVideoSnippet,
  stateMaker,
} from "utils/helper/testUtils";

const fetchedPlaylistItems: PlaylistItem[] = Array.from(
  { length: 10 },
  (_, idx) => idx + 1
).map((val, idx) => ({
  kind: "youtube#playlistItem",
  id: val.toString(),
  snippet: makePlaylistSnippet(val, idx),
}));

const fetchedVideoItem: VideoItem = {
  id: "videoId",
  kind: "youtube#video",

  // gives random videoId and itemId
  snippet: makeVideoSnippet(Math.random(), Math.random()),
};

const playlist: FetchedPlaylist = {
  id: "playlistId",
  items: fetchedPlaylistItems,
};

const video: FetchedVideo = {
  id: "videoId",
  items: [fetchedVideoItem],
};

const url = "http://sample.test.com";

const playlistParams: BaseFetchParams & PlaylistParams = {
  apiKey: "key",
  part: "snippet",
  maxResults: "50",
  playlistId: "",
  fields: [
    "items(id,kind,snippet(title,playlistId,thumbnails,resourceId))",
    "nextPageToken",
  ],
};

const playlistNextParams: BaseFetchParams & PlaylistParams = {
  ...playlistParams,
  pageToken: "nextToken",
};

const videoParams: BaseFetchParams & VideoParams = {
  apiKey: "key",
  part: "snippet",
  id: "videoId",
  maxResults: "5",
  fields: ["items(id,kind,snippet(title,thumbnails))"],
};

// ================================================
// Mock up ytplaylist redux states
// ================================================
const basePlaylistsState: Playlists = {
  updating: false,
  entities: {
    playlistItems: {},
    playlists: {},
    snippets: {},
  },
  result: [],
};

const baseVideosState: Videos = {
  entities: {
    videoItems: {},
    videos: {},
    snippets: {},
  },
  result: [],
};

const baseListToPlayStates: ListToPlay = {
  entities: {
    playlistItems: {},
    videoItems: {},
  },
  result: [],
};

const playlists = stateMaker(basePlaylistsState) as Playlists;
const videos = stateMaker(baseVideosState) as Videos;
// ================================================
// End mock up ytplaylist redux states
// ================================================

// ================================================
// Globals
// ================================================
global.fetchedPlaylistItems = fetchedPlaylistItems;
global.fetchedVideoItem = fetchedVideoItem;
global.playlist = playlist;
global.video = video;
global.url = url;
global.playlistParams = playlistParams;
global.playlistNextParams = playlistNextParams;
global.videoParams = videoParams;

// redux
global.basePlaylists = basePlaylistsState;
global.baseVideos = baseVideosState;
global.baseListToPlay = baseListToPlayStates;
global.playlists = playlists;
global.videos = videos;
// ================================================
// End Globals
// ================================================

// deep freeze immutable states in global
deepFreeze(basePlaylistsState);
deepFreeze(baseVideosState);
deepFreeze(baseListToPlayStates);
