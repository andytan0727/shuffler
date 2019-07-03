// =====================================
// Fetch
// =====================================
/**
 * @typedef BaseFetchParams
 * @property {string} apiKey Api key for fetching the data
 * @property {string} part  Holds the value of "snippet:
 * @property {string} maxResults  Max number of items fetched per request
 * @property {Array<string>} fields Array of contents returned by the request
 *
 */

/**
 * @typedef {BaseFetchParams & { playlistId?: string; pageToken?: string; }} PlaylistParams
 */

/**
 * @typedef {BaseFetchParams & { id?: string; }} VideoParams
 */

/**
 * @typedef {PlaylistParams & VideoParams} FetchParams Config params for fetching data from YouTube Data API
 *
 */

// =====================================
// Events
// =====================================
/**
 * @typedef {React.ChangeEvent<HTMLInputElement>} InputChangeEvent
 */

/**
 * @typedef {React.MouseEvent<HTMLButtonElement, MouseEvent>} ButtonOnClickEvent
 */

// =====================================
// React Router
// =====================================
/**
 * @typedef MatchRoute
 * @property {boolean} isExact
 * @property {*} params
 * @property {string} path
 * @property {string} url
 */
