import axios from "axios";
/**
 *
 * Get playlist items from YouTube API v3
 * @param {string} baseUrl Base url of YouTube Data API
 * @param {object} params Params (query strings) for the GET request
 * @return {object} Data object contains information about playlist
 */
const fetchPlaylistItems = async (baseUrl, params) => {
  const { maxResults, playlistId, apiKey } = params;
  const part = encodeURIComponent(params.part);
  const fields = encodeURIComponent(params.fields.join(","));
  const pageToken = params.pageToken ? params.pageToken : "";

  const apiReq = `${baseUrl}?part=${part}&maxResults=${maxResults}&playlistId=${playlistId}&fields=${fields}&pageToken=${pageToken}&key=${apiKey}`;

  try {
    const res = await axios.get(apiReq);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export { fetchPlaylistItems };
