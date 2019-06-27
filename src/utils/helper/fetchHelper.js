import axios from "axios";
/**
 *
 * Fetch YouTube Data (Playlist/Video) from YouTube API v3
 * @param {string} baseUrl Base url of YouTube Data API
 * @param {FetchParams} params Params (query strings) for the GET request
 * @param {("playlist"|"video")} dataType Enum of data to fetch (playlist/video)
 * @return {Promise<PlaylistItem>} Data object contains information about playlist
 */
const fetchYoutubeAPIData = async (baseUrl, params, dataType) => {
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
    dataType === "playlist"
      ? `${baseUrl}?part=${part}&maxResults=${maxResults}&playlistId=${playlistId}&fields=${fields}&pageToken=${pageToken}&key=${apiKey}`
      : `${baseUrl}?part=${part}&maxResults=${maxResults}&id=${id}&fields=${fields}&key=${apiKey}`;

  try {
    const res = await axios.get(apiReq);
    return res.data;
  } catch (err) {
    // throw specific error about fetching playlist
    if (dataType === "playlist") {
      if (err.response.status === 404)
        throw new Error("404 Playlist Not Found");
    }

    if (dataType === "video") {
      if (err.response.status === 404) throw new Error("404 Vide Not Found");
    }

    // throw general error
    throw err;
  }
};

export { fetchYoutubeAPIData };
