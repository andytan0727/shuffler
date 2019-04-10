import axios from "axios";
/**
 *
 * Fetch YouTube Data (Playlist/Video) from YouTube API v3
 * @param {string} baseUrl Base url of YouTube Data API
 * @param {object} params Params (query strings) for the GET request
 * @param {string} dataType Enum of data to fetch (playlist/video)
 * @return {object} Data object contains information about playlist
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
    throw err;
  }
};

export { fetchYoutubeAPIData };
