/**
 * @typedef YTAPIState
 * @property {string} apiKey
 * @property {string} playlistUrl
 * @property {YTAPiPlaylistItems} playlistItems
 * @property {string} videoUrl
 * @property {YTAPIVideoItems} videos
 * @property {Array<string>} fetchedPlaylistId
 * @property {Array<string>} fetchedVideoId
 */

/**
 * @typedef YTAPIParamOptions
 * @property {string} part
 * @property {string} maxResults
 * @property {string=} playlistId Id for playlist
 * @property {string=} id Id for Video
 * @property {Array<string>} fields
 */

/**
 * @typedef YTAPiPlaylistItems
 * @property {string} apiBaseUrl
 * @property {YTAPIParamOptions} options
 * @property {Array<Playlist>} fetchedData
 * @property {boolean} fetchLoading
 */

/**
 * @typedef YTAPIVideoItems
 * @property {string} apiBaseUrl
 * @property {YTAPIParamOptions} options
 * @property {Array<Video>} fetchedData
 * @property {boolean} fetchLoading
 */

/**
 * @typedef FetchPlaylistDataAction
 * @property {string} type
 * @property {{ url: string; params: FetchParams; }} payload
 */

/**
 * @typedef FetchPlaylistDataSuccessAction
 * @property {string} type
 * @property {{ data: Playlist; }} payload
 */

/**
 * @typedef FetchPlaylistDataFailedAction
 * @property {string} type
 */

/**
 * @typedef AddFetchedPlaylistIdAction
 * @property {string} type
 * @property {{ id: string; }} payload
 */

/**
 * @typedef SetPlaylistUrlAction
 * @property {string} type
 * @property {{ playlistUrl: string }} payload
 */

/**
 * @typedef FetchVideoDataAction
 * @property {string} type
 * @property {{ url: string; params: FetchParams; }} payload
 */

/**
 * @typedef FetchVideoDataSuccessAction
 * @property {string} type
 * @property {{ data: Video; }} payload
 */

/**
 * @typedef FetchVideoDataFailedAction
 * @property {string} type
 */

/**
 * @typedef AddFetchedVideoIdAction
 * @property {string} type
 * @property {{ id: string; }} payload
 */

/**
 * @typedef SetVideoUrlAction
 * @property {string} type
 * @property {{ videoUrl: string }} payload
 */

/**
 * @typedef {FetchPlaylistDataAction &
 *   FetchPlaylistDataSuccessAction &
 *   FetchPlaylistDataSuccessAction &
 *   AddFetchedPlaylistIdAction &
 *   SetPlaylistUrlAction &
 *   FetchVideoDataAction &
 *   FetchVideoDataSuccessAction &
 *   FetchVideoDataFailedAction &
 *   AddFetchedVideoIdAction &
 *   SetVideoUrlAction} YTAPIActions
 */
