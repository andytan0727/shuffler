import uniqBy from "lodash.uniqby";
import shuffle from "lodash.shuffle";
import {
  ADD_PLAYLIST,
  RENAME_PLAYLIST,
  SET_CHECKED_PLAYLISTS,
  ADD_PLAYING_PLAYLISTS,
  ADD_LIST_TO_PLAY,
  UPDATE_LIST_TO_PLAY,
  CLEAR_LIST_TO_PLAY,
  REMOVE_PLAYLIST_FROM_PLAYING,

  // videos
  ADD_VIDEO,
  REMOVE_VIDEO,
  DELETE_VIDEO,
  SET_CHECKED_VIDEOS,
  ADD_PLAYING_VIDEOS,
  REMOVE_PLAYING_VIDEOS,
  TOGGLE_PLAYING_VIDEO,
  REMOVE_VIDEO_FROM_PLAYING,
  APPEND_LIST_TO_PLAY,
  REMOVE_PLAYING_PLAYLISTS,
  REMOVE_PLAYLISTS,
  REMOVE_FROM_LIST_TO_PLAY,
} from "../../utils/constants/actionConstants";

import { notify } from "../../utils/helper/notifyHelper";

// ============================
// Playlist
// ============================
/**
 * Add playlist to Redux store
 * @param {Playlist} playlist A playlist object structured according to YouTube Data Api
 * @returns {AddPlaylistAction} ADD_PLAYLIST action object
 */

export const addPlaylistAction = (playlist) => ({
  type: ADD_PLAYLIST,
  payload: {
    playlist,
  },
});

/**
 * Remove playlist(s) from playlists
 *
 * @param {Array<string>} playlistIds Playlist id(s) to remove
 * @returns {RemovePlaylistsAction} REMOVE_PLAYLISTS action object
 */
export const removePlaylistsAction = (playlistIds) => ({
  type: REMOVE_PLAYLISTS,
  payload: {
    playlistIds,
  },
});

/**
 * Rename selected playlist (one at once)
 *
 * @param {string} newName New name of selected playlist
 * @param {string} playlistIdToRename Selected playlist's id
 * @returns {function} Thunk function
 */
export const renamePlaylist = (newName, playlistIdToRename) => {
  return (dispatch, getState) => {
    const { playlists } = getState().ytplaylist;

    const updatedPlaylists = playlists.map((playlist) => {
      if (playlist.id === playlistIdToRename) {
        playlist.name = newName;
      }
      return playlist;
    });

    dispatch({
      type: RENAME_PLAYLIST,
      payload: {
        updatedPlaylists,
      },
    });
  };
};

/**
 * Set checked playlist in Redux store
 * @param {Array<string>} checkedPlaylists selected playlists
 * @returns {SetCheckedPlaylistsAction} SET_CHECKED_PLAYLISTS action object for redux store
 */
export const setCheckedPlaylists = (checkedPlaylists) => ({
  type: SET_CHECKED_PLAYLISTS,
  payload: {
    checkedPlaylists,
  },
});

/**
 * Shuffle listToPlay
 * @returns {function} Thunk function
 *
 */
export const shufflePlaylist = () => {
  return (dispatch, getState) => {
    const { listToPlay } = getState().ytplaylist;

    if (listToPlay.length) dispatch(updateListToPlay(shuffle(listToPlay)));
  };
};

/**
 * Add playlist id(s) in playlistIds to playingPlaylists
 *
 * @param {Array<string>} playlistIds Playlists' id to add
 * @returns {AddPlayingPlaylistsAction} ADD_PLAYING_PLAYLISTS action object
 */
export const addPlayingPlaylistsAction = (playlistIds) => ({
  type: ADD_PLAYING_PLAYLISTS,
  payload: {
    playlistIds,
  },
});

/**
 * Remove playlist id(s) in playlistIds from playingPlaylists
 *
 * @param {Array<string>} playlistIds Playlists' id to remove
 * @returns {RemovePlayingPlaylistsAction} REMOVE_PLAYING_PLAYLISTS action object
 */
export const removePlayingPlaylistsAction = (playlistIds) => ({
  type: REMOVE_PLAYING_PLAYLISTS,
  payload: {
    playlistIds,
  },
});

/**
 * Remove selected playlist(s) from playingList
 *
 * @returns {function} Thunk function
 *
 */
export const removePlaylistFromPlaying = () => {
  return (dispatch, getState) => {
    /** @type {PlaylistState} */
    const {
      checkedPlaylists: playlistIdsToRemove,
      playlists,
      listToPlay,
      playingPlaylists,
    } = getState().ytplaylist;

    /** @type {Array<string>} */
    const songsToRemove = [];

    if (!playlistIdsToRemove.length) {
      return;
    }

    for (const playlistIdToRemove of playlistIdsToRemove) {
      const playlistToRemove = playlists.filter(
        (playlist) => playlist.id === playlistIdToRemove
      )[0];
      const playlistIdentifier = playlistToRemove.name || playlistIdToRemove;

      if (!playingPlaylists.includes(playlistIdToRemove)) {
        notify(
          "warning",
          `playlist: ${playlistIdentifier} is not included in playing`
        );
        continue;
      }

      songsToRemove.push(
        ...playlists
          .filter((playlist) => playlist.id === playlistIdToRemove)
          // @ts-ignore
          .flatMap(
            /** @param {Playlist} filteredPlaylist */
            (filteredPlaylist) => filteredPlaylist.items
          )
          .flatMap(
            /** @param {Playlist} filteredItem */
            (filteredItem) => filteredItem.id
          )
      );

      notify(
        "success",
        `Successfully removed playlist: ${playlistIdentifier} from playing 😎`
      );
    }

    // update listToPlay
    const updatedListToPlay = listToPlay.filter(
      (video) => !songsToRemove.includes(video.id)
    );

    // update playingPlaylists
    const updatedPlayingPlaylists = playingPlaylists.filter(
      (playlistId) => !playlistIdsToRemove.includes(playlistId)
    );

    // remove playlists and clear checked playlists
    dispatch({
      type: REMOVE_PLAYLIST_FROM_PLAYING,
      payload: {
        updatedPlayingPlaylists,
      },
    });
    dispatch(updateListToPlay(updatedListToPlay));
    dispatch(setCheckedPlaylists([]));
  };
};

// ===============================================
// videos
// ===============================================
/**
 * Add fetched video to Redux store
 * @param {Video} videoToAdd An object of video id and items from YouTube Data API
 * @returns {AddVideoAction} ADD_VIDEO action object
 */
export const addVideoAction = (videoToAdd) => ({
  type: ADD_VIDEO,
  payload: {
    videoToAdd,
  },
});

/**
 * Remove checked video in checkedVideos array
 * @returns {function} Thunk function
 */
export const removeVideo = () => {
  return (dispatch, getState) => {
    const { checkedVideos: videosToRemove, videos } = getState().ytplaylist;
    if (!videosToRemove.length) {
      return;
    }

    const updatedVideos = videos.filter(
      (video) => !videosToRemove.includes(video.id)
    );

    dispatch({
      type: REMOVE_VIDEO,
      payload: {
        updatedVideos,
      },
    });
    dispatch(removePlayingVideos(videosToRemove));
  };
};

/**
 * Delete ONE video from saved videos
 *
 * @param {string} videoId Id for video to be deleted
 * @returns {function} Thunk function
 */
export const deleteVideo = (videoId) => {
  return (dispatch, getState) => {
    const { videos, listToPlay } = getState().ytplaylist;

    // updates videos array
    const updatedVideos = videos.filter((video) => video.id !== videoId);

    // updates listToPlay
    const updatedListToPlay = listToPlay.filter(
      (video) => video.id !== videoId
    );

    dispatch({
      type: DELETE_VIDEO,
      payload: {
        videos: updatedVideos,
      },
    });
    dispatch(updateListToPlay(updatedListToPlay));
    dispatch(removePlayingVideos([videoId]));
  };
};

/**
 * Set checked videos in Redux store
 * @param {Array<string>} checkedVideos An array of checked video id to store
 * @returns {SetCheckedVideosAction} SET_CHECKED_VIDEOS action object for redux store
 */
export const setCheckedVideos = (checkedVideos) => ({
  type: SET_CHECKED_VIDEOS,
  payload: {
    checkedVideos,
  },
});

/**
 * Add videos' id specified by videoIds array to playingVideos
 *
 * @param {Array<string>} videoIds Videos id array
 * @returns {AddPlayingVideoAction} ADD_PLAYING_VIDEOS action object
 */
export const addPlayingVideosAction = (videoIds) => ({
  type: ADD_PLAYING_VIDEOS,
  payload: {
    videoIds,
  },
});

/**
 * Remove videos specified by videoIds array from playingVideos
 *
 * @param {Array<string>} videoIds Videos id to remove array
 * @returns {function} Thunk function for redux store
 */
export const removePlayingVideos = (videoIds) => {
  return (dispatch, getState) => {
    const { playingVideos } = getState().ytplaylist;

    const updatedPlayingVideos = playingVideos.filter(
      (videoId) => !videoIds.includes(videoId)
    );

    dispatch({
      type: REMOVE_PLAYING_VIDEOS,
      payload: {
        playingVideos: updatedPlayingVideos,
      },
    });
  };
};

/**
 * Toggle add or remove video from listToPlay
 *
 * @param {string} id Video id to add/remove from listToPlay
 * @returns {function} Thunk function
 */
export const togglePlayingVideo = (id) => {
  return (dispatch, getState) => {
    const { videos, playingVideos, listToPlay } = getState().ytplaylist;

    const isPlayingVideoPreviously = playingVideos.includes(id);

    const updatedListToPlay = !isPlayingVideoPreviously
      ? uniqBy(
          [
            ...listToPlay,
            ...videos
              .filter((video) => video.id === id)
              .flatMap((filteredVideo) => filteredVideo.items),
          ],
          "id"
        )
      : listToPlay.filter((video) => video.id !== id);

    dispatch({
      type: TOGGLE_PLAYING_VIDEO,
    });

    if (isPlayingVideoPreviously) {
      dispatch(removePlayingVideos([id]));
    } else {
      dispatch(addPlayingVideosAction([id]));
    }

    dispatch(updateListToPlay(updatedListToPlay));
  };
};

// ===============================================
// listToPlay
// ===============================================
/**
 * Add playlists/videos to listToPlay
 * @param {object} params
 * @param {boolean} params.checked Use checkedPlaylists/checkedVideos in Redux store if true
 * @param {Array<string>} params.listToAdd An array of video to add
 * @returns Thunk function
 */
export const addListToPlay = ({ checked, listToAdd }) => {
  return (dispatch, getState) => {
    const {
      playingPlaylists,
      playingVideos,
      checkedPlaylists,
      checkedVideos,
      listToPlay,
      playlists,
      videos,
    } = getState().ytplaylist;
    let updatedListToPlay, checkedListToClear;

    // fix accidentally mutated state problem in playlists and videos
    const newPlayingPlaylists = [...playingPlaylists];
    const newPlayingVideos = [...playingVideos];

    // add playlists
    if (checked && !checkedVideos.length) {
      updatedListToPlay = [
        ...listToPlay,
        ...playlists
          .filter((playlist) => checkedPlaylists.includes(playlist.id))
          .flatMap((filteredPlaylist) => filteredPlaylist.items),
      ];

      // push chosen playlists' id to playingPlaylists array
      checkedPlaylists.forEach((playlistId) => {
        if (!newPlayingPlaylists.includes(playlistId)) {
          newPlayingPlaylists.push(playlistId);
        }
      });

      checkedListToClear = "playlist";

      // add videos
    } else if (checked && !checkedPlaylists.length) {
      updatedListToPlay = [
        ...listToPlay,
        ...videos
          .filter((video) => checkedVideos.includes(video.id))
          .flatMap((filteredVideo) => filteredVideo.items),
      ];

      // push chosen videos' id to playingVideos array
      checkedVideos.forEach((videoId) => {
        if (!newPlayingVideos.includes(videoId)) {
          newPlayingVideos.push(videoId);
        }
      });

      dispatch(addPlayingVideosAction(newPlayingVideos));
      checkedListToClear = "video";
    } else {
      // for hydration
      updatedListToPlay = [...listToPlay, ...listToAdd];
    }

    const uniqueListToPlay = uniqBy(updatedListToPlay, "id");

    dispatch({
      type: ADD_LIST_TO_PLAY,
      payload: {
        updatedPlayingPlaylists: newPlayingPlaylists,
        checkedListToClear,
      },
    });
    dispatch(updateListToPlay(uniqueListToPlay));
  };
};

/** NOTE: (mayb) replace addListToPlay action in the future
 * Action to append new item(s) (video/playlist) to listToPlay
 *
 * @param {Array<(PlaylistItem | VideoItem)>} items Items obtained from API (items key in json returned)
 * @returns {AppendListToPlayAction} APPEND_LIST_TO_PLAY action object
 */
export const appendListToPlayAction = (items) => ({
  type: APPEND_LIST_TO_PLAY,
  payload: {
    items,
  },
});

/**
 * Remove item(s) containing itemIds from listToPlay
 *
 * @param {Array<string>} itemIds Playlist/Video' ids
 * @param {"playlist"|"video"} itemType  Type of item to remove (playlist/video)
 */
export const removeFromListToPlayAction = (itemIds, itemType) => ({
  type: REMOVE_FROM_LIST_TO_PLAY,
  payload: {
    itemIds,
    itemType,
  },
});

/**
 * Update listToPlay with updatedList supplied
 *
 * @param {Array<(PlaylistItem | VideoItem)>} updatedList Updated array of listToPlay
 * @returns {function} Thunk function for redux store
 */
export const updateListToPlay = (updatedList) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_LIST_TO_PLAY,
      payload: {
        listToPlay: updatedList,
      },
    });
  };
};

/**
 * Clear current playing playlist
 * @returns CLEAR_LIST_TO_PLAY action object for redux store
 */
export const clearListToPlay = () => ({
  type: CLEAR_LIST_TO_PLAY,
});

/**
 * Remove selected video(s) from playingList
 *
 * @returns {function} Thunk function
 *
 */
export const removeVideoFromPlaying = () => {
  return (dispatch, getState) => {
    const {
      checkedVideos: videosToRemove,
      listToPlay,
      playingVideos,
    } = getState().ytplaylist;

    if (!videosToRemove.length) {
      return;
    }

    const filteredVideosToRemove = videosToRemove.filter((videoId) => {
      const isVideoIdIncluded = playingVideos.includes(videoId);

      if (!isVideoIdIncluded) {
        notify(
          "warning",
          `Video-${videoId} does not included in playing list.`
        );
      }

      return isVideoIdIncluded;
    });

    // clear checkedVideos and return if no video to remove
    if (filteredVideosToRemove.length === 0) {
      dispatch(setCheckedVideos([]));
      return;
    }

    // proceed if filteredVideosToRemove is not empty
    const updatedListToPlay = listToPlay.filter(
      (video) => !filteredVideosToRemove.includes(video.id)
    );

    dispatch({
      type: REMOVE_VIDEO_FROM_PLAYING,
    });
    dispatch(removePlayingVideos(filteredVideosToRemove));
    dispatch(updateListToPlay(updatedListToPlay));
    dispatch(setCheckedVideos([]));

    notify("success", "Successfully removed selected video(s) from playing 😎");
  };
};
