/**
 * @typedef PlayerState
 * @property {boolean} playing
 * @property {boolean} repeat
 * @property {number} curSongIdx
 * @property {Object} playerVars
 * @property {number} playerVars.autoplay
 * @property {number} playerVars.controls
 * @property {number} playerVars.fs
 * @property {number} playerVars.rel
 * @property {number} playerVars.modestbranding
 * @property {number} playerVars.loop
 * @property {number} playerVars.iv_load_policy
 *
 */

/**
 * @typedef SetCurrentSongIdxAction
 * @property {string} type
 * @property {{ songIdx: number }} payload
 */

/**
 * @typedef SetVideoPlayingAction
 * @property {string} type
 * @property {{ playing: boolean }} payload
 */

/**
 * @typedef ToggleRepeatAction
 * @property {string} type
 */

/**
 * @typedef {SetCurrentSongIdxAction &
 *  SetVideoPlayingAction &
 *  ToggleRepeatAction} PlayerActions
 */
