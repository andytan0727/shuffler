/**
 * @typedef BaseFetchParams
 * @property {string} apiKey Api key for fetching the data
 * @property {string} part  Holds the value of "snippet:
 * @property {string} maxResults  Max number of items fetched per request
 * @property {Array<string>} fields Array of contents returned by the request
 *
 */

/**
 * @typedef {BaseFetchParams & PlaylistParams & VideoParams} FetchParams Config params for fetching data from YouTube Data API
 *
 */
