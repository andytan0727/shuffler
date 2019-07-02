/**
 * @typedef VideoThumbnails
 * @property {VideoThumbnailsProperties} default
 * @property {VideoThumbnailsProperties} medium
 * @property {VideoThumbnailsProperties} standard
 * @property {VideoThumbnailsProperties} high
 * @property {VideoThumbnailsProperties} [maxres]
 *
 */

/**
 * @typedef VideoThumbnailsProperties
 * @property {number} height Height of video iframe
 * @property {string} url Url of the video thumbnail
 * @property {number} width Width of video iframe
 *
 */

/**
 * @typedef Video
 * @property {string} id Video id
 * @property {Array<VideoItem>} items Video items in fetched data
 *
 */

/**
 * @typedef VideoItem
 * @property {string} etag Random string
 * @property {string} id Video id
 * @property {string} kind Type of fetched data
 * @property {VideoItemSnippet} snippet
 *
 */

/**
 * @typedef VideoItemSnippet
 * @property {string} categoryId
 * @property {string} channelId
 * @property {string} channelTitle
 * @property {string} description Video description
 * @property {string} liveBroadcastContent
 * @property {string} publishedAt Video published date
 * @property {Array<string>} tags Video tags
 * @property {VideoThumbnails} thumbnails Video thumbnails
 * @property {string} title Video titel
 * @property {{ title: string; description: string }} localized
 *
 */
