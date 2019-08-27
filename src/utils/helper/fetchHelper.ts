import axios from "axios";
import {
  FetchedPlaylist,
  FetchedVideo,
  PlaylistItem,
} from "store/ytplaylist/types";

/**
 *
 * Fetch YouTube Data (Playlist/Video) from YouTube API v3
 * @param baseUrl Base url of YouTube Data API
 * @param params Params (query strings) for the GET request
 * @param dataType Enum of data to fetch (playlist/video)
 * @return Data object contains information about playlist/video
 */
export const fetchYoutubeAPIData = async (
  baseUrl: string,
  params: FetchParams,
  dataType: MediaSourceType
): Promise<FetchedPlaylist | FetchedVideo> => {
  const {
    maxResults,
    playlistId,
    apiKey,

    // for video
    id,
  } = params;
  const part = encodeURIComponent(params.part);
  const fields = encodeURIComponent(params.fields.join(","));
  const pageToken = params.pageToken || "";

  const apiReq =
    dataType === "playlists"
      ? `${baseUrl}?part=${part}&maxResults=${maxResults}&playlistId=${playlistId}&fields=${fields}&pageToken=${pageToken}&key=${apiKey}`
      : `${baseUrl}?part=${part}&maxResults=${maxResults}&id=${id}&fields=${fields}&key=${apiKey}`;

  try {
    const res = await axios.get(apiReq);
    return res.data;
  } catch (err) {
    // throw specific error about fetching playlist
    if (dataType === "playlists") {
      if (err.response.status === 404)
        throw new Error("404 Playlist Not Found");
    }

    if (dataType === "videos") {
      if (err.response.status === 404) throw new Error("404 Vide Not Found");
    }

    // throw general error
    throw err;
  }
};

/**
 * Recursively fetch playlist data (playlist items)
 *
 * @param url Url needed for YouTube Data API
 * @param params Params needed for YouTube Data API
 * @returns Playlist data fetched in the form of playlist items array
 */
export const recursivelyFetchPlaylistData = async (
  url: string,
  params: FetchParams
) => {
  let count = 2;
  const items: PlaylistItem[] = [];

  let data: FetchedPlaylist = (await fetchYoutubeAPIData(
    url,
    params,
    "playlists"
  )) as FetchedPlaylist;

  items.push(...data.items);

  while (data.nextPageToken) {
    if (count > 5) {
      alert(
        "Number of videos in your playlist exceeded limit set by us (250 videos/playlist)"
      );
      break;
    }

    data = (await fetchYoutubeAPIData(
      url,
      {
        ...params,
        pageToken: data.nextPageToken,
      },
      "playlists"
    )) as FetchedPlaylist;

    items.push(...data.items);
    count++;
  }

  return items;
};
