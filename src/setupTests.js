/** @type {Array<PlaylistItem>} */
const fetchedPlaylistItems = Array.from(
  { length: 10 },
  (_, idx) => idx + 1
).map((val) => ({
  etag: "randomeTag",
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

/** @type {VideoItem} */
const fetchedVideoItem = {
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

/** @type {Playlist} */
const playlist = {
  id: "playlistId",
  items: fetchedPlaylistItems,
};

/** @type {Video} */
const video = {
  id: "videoId",
  items: [fetchedVideoItem],
};

const url = "http://sample.test.com";

/** @type {BaseFetchParams & PlaylistParams} */
const playlistParams = {
  apiKey: "key",
  part: "snippet",
  maxResults: "50",
  playlistId: "",
  fields: ["items", "nextPageToken", "pageInfo"],
};

/** @type {BaseFetchParams & PlaylistParams} */
const playlistNextParams = {
  ...playlistParams,
  pageToken: "nextToken",
};

/** @type {BaseFetchParams & VideoParams} */
const videoParams = {
  apiKey: "key",
  part: "snippet",
  id: "videoId",
  maxResults: "5",
  fields: ["items"],
};

/** @type {*} */
const customGlobal = global;
customGlobal.fetchedPlaylistItems = fetchedPlaylistItems;
customGlobal.fetchedVideoItem = fetchedVideoItem;
customGlobal.playlist = playlist;
customGlobal.video = video;
customGlobal.url = url;
customGlobal.playlistParams = playlistParams;
customGlobal.playlistNextParams = playlistNextParams;
customGlobal.videoParams = videoParams;
