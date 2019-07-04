/**
 * @typedef Playlist
 * @property {string} id Playlist id
 * @property {string} [name] Optional name assigned by user
 * @property {string} [nextPageToken] Token for next page request
 * @property {Array<PlaylistItem>} items
 */

/**
 * @typedef PlaylistItem
 * @property {string} etag Random string
 * @property {string} id Id of playlist video fetched
 * @property {string} kind Type of fetched data
 * @property {PlaylistItemSnippet} snippet Snippet
 *
 */

/**
 * @typedef PlaylistItemSnippet
 * @property {string} channelId Id of playlist owner's channel
 * @property {string} channelTitle
 * @property {string} description Description of the video
 * @property {string} playlistId Id of the playlist
 * @property {number} position Video position in the playlist
 * @property {string} publishedAt Publish date
 * @property {string} title Video title
 * @property {{ kind: string; videoId: string }} resourceId
 * @property {VideoThumbnails} thumbnails
 */
