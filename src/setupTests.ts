import {
  FetchedPlaylist,
  FetchedVideo,
  PlaylistItem,
  VideoItem,
} from "store/ytplaylist/types";

const fetchedPlaylistItems: PlaylistItem[] = Array.from(
  { length: 10 },
  (_, idx) => idx + 1
).map((val) => ({
  etag: "randomTag",
  kind: "youtube#playlistItem",
  id: val.toString(),
  snippet: {
    playlistId: "playlistId",
    name: "Optional name",
    channelId: "testChannelId",
    channelTitle: "testChannelTitle",
    title: `video-${val}`,
    description: "playlist description",
    position: 1,
    publishedAt: "2019-02-02",
    resourceId: {
      kind: "youtube#video",
      videoId: `vid-${val}`,
    },
    thumbnails: {
      default: { height: 120, width: 120, url: "test.com" },
      medium: { height: 120, width: 120, url: "test.com" },
      high: { height: 120, width: 120, url: "test.com" },
      standard: { height: 120, width: 120, url: "test.com" },
      maxres: { height: 120, width: 120, url: "test.com" },
    },
  },
}));

const fetchedVideoItem: VideoItem = {
  etag: "random_string",
  id: "videoId",
  kind: "youtube#video",
  snippet: {
    categoryId: "cat1",
    channelId: "testChannelId",
    channelTitle: "testChannelTitle",
    liveBroadcastContent: "test",
    localized: { title: "localTitle", description: "localDescription" },
    publishedAt: "2019-02-12",
    tags: ["test", "video"],
    title: `video title`,
    description: "video description",
    thumbnails: {
      default: { height: 120, width: 120, url: "test.com" },
      medium: { height: 120, width: 120, url: "test.com" },
      high: { height: 120, width: 120, url: "test.com" },
      standard: { height: 120, width: 120, url: "test.com" },
      maxres: { height: 120, width: 120, url: "test.com" },
    },
  },
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
  fields: ["items", "nextPageToken", "pageInfo"],
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
  fields: ["items"],
};

// assign to global
global.fetchedPlaylistItems = fetchedPlaylistItems;
global.fetchedVideoItem = fetchedVideoItem;
global.playlist = playlist;
global.video = video;
global.url = url;
global.playlistParams = playlistParams;
global.playlistNextParams = playlistNextParams;
global.videoParams = videoParams;
