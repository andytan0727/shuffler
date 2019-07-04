// ==============================
// Playlist
// ==============================

/**
 * @typedef {Array<PlaylistItem | VideoItem>} ListToPlay
 *
 */

/**
 * @typedef PlaylistState
 * @property {Array<string>} checkedPlaylists
 * @property {Array<string>} checkedVideos
 * @property {Array<Playlist>} playlists
 * @property {Array<Video>} videos
 * @property {ListToPlay} listToPlay
 * @property {Array<string>} playingPlaylists
 * @property {Array<string>} playingVideos
 */

/**
 * @typedef AddPlaylistAction
 * @property {string} type
 * @property {{ playlist: Playlist }} payload
 */

/**
 * @typedef DeletePlaylistsAction
 * @property {string} type
 * @property {{ playlistIds: Array<string> }} payload
 */

/**
 * @typedef RenamePlaylistAction
 * @property {string} type
 * @property {{ newName: string; playlistIdToRename: string; }} payload
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
 * @typedef AddPlaylistsToListToPlayAction
 * @property {"ADD_PLAYLISTS_TO_LIST_TO_PLAY"} type
 * @property {{ playlistIds: Array<string>; }} payload
 */

/**
 * @typedef RemovePlaylistsFromListToPlayAction
 * @property {string} type
 * @property {{ playlistIds: Array<string>; }} payload
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
 * @typedef DeleteVideosAction
 * @property {string} type
 * @property {{ videoIds: Array<string>; }} payload
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
 * @property {{ videoIds: Array<string> }} payload
 */

/**
 * @typedef TogglePlayingVideoAction
 * @property {string} type
 * @property {{ videoId: string; }} payload
 */

/**
 * @typedef AddVideosToListToPlayAction
 * @property {"ADD_VIDEOS_TO_LIST_TO_PLAY"} type
 * @property {{ videoIds: Array<string>; }} payload
 */

/**
 * @typedef RemoveVideosFromListToPlayAction
 * @property {string} type
 * @property {{ videoIds: Array<string>; }} payload
 */

/**
 * @typedef AppendListToPlayAction
 * @property {"APPEND_LIST_TO_PLAY"} type
 * @property {{ items: ListToPlay }} payload
 */

/**
 * @typedef RemoveFromListToPlayAction
 * @property {string} type
 * @property {{ itemIds: Array<string>; itemType: ("playlist"|"video") }} payload
 */

/**
 * @typedef UpdateListToPlayAction
 * @property {string} type
 * @property {{ listToPlay: ListToPlay }} payload
 */

/**
 * @typedef ClearListToPlayAction
 * @property {"CLEAR_LIST_TO_PLAY"} type
 */

/**
 * @typedef ShuffleListToPlayAction
 * @property {"SHUFFLE_LIST_TO_PLAY"} type
 */

/**
 * @typedef RemoveVideoFromPlayingAction
 * @property {string} type
 */

/**
 * @typedef {AddPlaylistAction &
 *  DeletePlaylistsAction &
 *  RenamePlaylistAction &
 *  SetCheckedPlaylistsAction &
 *  AddPlayingPlaylistsAction &
 *  RemovePlayingPlaylistsAction &
 *  AddPlaylistsToListToPlayAction &
 *  RemovePlaylistsFromListToPlayAction &
 *  AddVideoAction &
 *  RemoveVideoAction &
 *  DeleteVideosAction &
 *  SetCheckedVideosAction &
 *  AddPlayingVideoAction &
 *  RemovePlayingVideosAction &
 *  TogglePlayingVideoAction &
 *  AppendListToPlayAction &
 *  RemoveFromListToPlayAction &
 *  UpdateListToPlayAction &
 *  ClearListToPlayAction &
 *  RemoveVideoFromPlayingAction} YTPlaylistActions
 *
 */
