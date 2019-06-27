// ==============================
// Playlist
// ==============================

/**
 * @typedef PlaylistStates
 * @property {Array<string>} checkedPlaylists
 * @property {Array<string>} checkedVideos
 * @property {Array<Playlist>} playlists
 * @property {Array<Video>} videos
 * @property {Array<PlaylistItem | VideoItem>} listToPlay
 * @property {Array<string>} playingPlaylists
 * @property {Array<string>} playingVideos
 */

/**
 * @typedef AddPlaylistAction
 * @property {string} type
 * @property {{ playlist: Playlist }} payload
 */

/**
 * @typedef RemovePlaylistsAction
 * @property {string} type
 * @property {{ playlistIds: Array<string> }} payload
 */

/**
 * @typedef RenamePlaylistAction
 * @property {string} type
 * @property {{ updatedPlaylists: Array<Playlist> }} payload
 */

/**
 * @typedef SetCheckedPlaylistsAction
 * @property {string} type
 * @property {{ checkedPlaylists: Array<string> }} payload
 */

/**
 * @typedef AddPlayingPlaylistsAction
 * @property {string} type
 * @property {{ playlistIds: Array<string> }} payload
 */

/**
 * @typedef RemovePlayingPlaylistsAction
 * @property {string} type
 * @property {{ playlistIds: Array<string> }} payload
 */

/**
 * @typedef RemovePlaylistFromPlayingAction
 * @property {string} type
 * @property {{ updatedPlayingPlaylists: Array<string> }} payload
 */

// ==============================
// Video
// ==============================

/**
 * @typedef AddVideoAction
 * @property {string} type
 * @property {{ videoToAdd: Video }} payload
 */

/**
 * @typedef RemoveVideoAction PENDING TO BE REMOVED
 * @property {string} type
 * @property {{ updatedVideos: Array<Video> }} payload
 */

/**
 * @typedef DeleteVideoAction
 * @property {string} type
 * @property {{ videos: Array<Video> }} payload
 */

/**
 * @typedef SetCheckedVideosAction
 * @property {string} type
 * @property {{ checkedVideos: Array<string> }} payload
 */

/**
 * @typedef AddPlayingVideoAction
 * @property {string} type
 * @property {{ videoIds: Array<string> }} payload
 */

/**
 * @typedef RemovePlayingVideosAction
 * @property {string} type
 * @property {{ playingVideos: Array<string> }} payload
 */

/**
 * @typedef TogglePlayingVideoAction
 * @property {string} type
 */

/**
 * @typedef AddListToPlayAction PENDING TO BE REMOVED
 * @property {string} type
 * @property {{ updatedPlayingPlaylists: Array<string>; checkedListToClear: ("playlist"|"video") }} payload
 */

/**
 * @typedef AppendListToPlayAction
 * @property {string} type
 * @property {{ items: Array<(PlaylistItem | VideoItem)> }} payload
 */

/**
 * @typedef RemoveFromListToPlayAction
 * @property {string} type
 * @property {{ itemIds: Array<string>; itemType: ("playlist"|"video") }} payload
 */

/**
 * @typedef UpdateListToPlayAction
 * @property {string} type
 * @property {{ listToPlay: Array<(PlaylistItem & VideoItem)> }} payload
 */

/**
 * @typedef ClearListToPlayAction
 * @property {string} type
 */

/**
 * @typedef RemoveVideoFromPlayingAction
 * @property {string} typedef
 */

/**
 * @typedef {AddPlaylistAction &
 *  RemovePlaylistsAction &
 *  RenamePlaylistAction &
 *  SetCheckedPlaylistsAction &
 *  AddPlayingPlaylistsAction &
 *  RemovePlayingPlaylistsAction &
 *  RemovePlaylistFromPlayingAction &
 *  AddVideoAction &
 *  RemoveVideoAction &
 *  DeleteVideoAction &
 *  SetCheckedVideosAction &
 *  AddPlayingVideoAction &
 *  RemovePlayingVideosAction &
 *  TogglePlayingVideoAction &
 *  AddListToPlayAction &
 *  AppendListToPlayAction &
 *  RemoveFromListToPlayAction &
 *  UpdateListToPlayAction &
 *  ClearListToPlayAction &
 *  RemoveVideoFromPlayingAction} YTPlaylistActions
 *
 */
