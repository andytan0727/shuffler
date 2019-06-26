import uniqBy from "lodash.uniqby";
import shuffle from "lodash.shuffle";
import union from "lodash.union";
import {
  ADD_PLAYLIST,
  REMOVE_PLAYLIST,
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
} from "../../utils/constants/actionConstants";

import { notify } from "../../utils/helper/notifyHelper";

/**
 * Add playlist to Redux store
 * @param {object} playlist A playlist object structured according to YouTube Data Api
 * @returns {function} Thunk function
 */
export const addPlaylist = (playlist) => {
  return (dispatch, getState) => {
    const { playlists: prevPlaylists } = getState().ytplaylist;
    const playlistToAdd = playlist;

    const isPlaylistExists = prevPlaylists.some(
      (playlist) => playlist.id === playlistToAdd.id
    );

    // return if playlist already existed
    if (isPlaylistExists) {
      return;
    }

    const updatedPlaylists = [...prevPlaylists, playlistToAdd];

    dispatch({
      type: ADD_PLAYLIST,
      payload: {
        playlists: updatedPlaylists,
      },
    });
  };
};

/**
 * Remove checked playlist in checkedPlaylists array
 * @returns {function} Thunk function
 */
export const removePlaylist = () => {
  return (dispatch, getState) => {
    const {
      checkedPlaylists: playlistsToRemove,
      playlists,
      playingPlaylists,
    } = getState().ytplaylist;

    if (!playlistsToRemove.length) {
      return;
    }

    const updatedPlaylist = playlists.filter(
      (playlist) => !playlistsToRemove.includes(playlist.id)
    );

    // also check playingPlaylists
    const updatedPlayingPlaylists = playingPlaylists.filter(
      (playlistId) => !playlistsToRemove.includes(playlistId)
    );

    dispatch({
      type: REMOVE_PLAYLIST,
      payload: {
        updatedPlaylist,
        updatedPlayingPlaylists,
      },
    });
  };
};

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
 * @returns SET_CHECKED_PLAYLISTS action object for redux store
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
 * Add playlists in listToPlay to playingPlaylists array
 *
 * @param {Array<string>} playlistIdsToAdd Playlists' id array
 * @returns {function} Thunk function
 */
export const addPlayingPlaylists = (playlistIdsToAdd) => {
  return (dispatch, getState) => {
    const {
      playingPlaylists: playingPlaylistsFromStore,
    } = getState().ytplaylist;
    const filteredPlaylistIds = playlistIdsToAdd.filter(
      (id) => !playingPlaylistsFromStore.includes(id)
    );
    const updatedPlayingPlaylists = [
      ...playingPlaylistsFromStore,
      ...filteredPlaylistIds,
    ];

    dispatch({
      type: ADD_PLAYING_PLAYLISTS,
      payload: {
        updatedPlayingPlaylists,
      },
    });
  };
};

/**
 * Remove selected playlist(s) from playingList
 *
 * @returns {function} Thunk function
 *
 */
export const removePlaylistFromPlaying = () => {
  return (dispatch, getState) => {
    const {
      checkedPlaylists: playlistsToRemove,
      playlists,
      listToPlay,
      playingPlaylists,
    } = getState().ytplaylist;

    let songsToRemove = [];

    if (!playlistsToRemove.length) {
      return;
    }

    for (const playlistIdToRemove of playlistsToRemove) {
      if (!playingPlaylists.includes(playlistIdToRemove)) {
        notify(
          "warning",
          `playlist-${playlistIdToRemove} is not included in playing`
        );
        continue;
      }

      songsToRemove.push(
        ...playlists
          .filter((playlist) => playlist.id === playlistIdToRemove)
          .flatMap((filteredPlaylist) => filteredPlaylist.items)
          .flatMap((filteredItem) => filteredItem.id)
      );

      notify(
        "success",
        `Successfully removed playlist-${playlistIdToRemove} from playing 😎`
      );
    }

    // update listToPlay
    const updatedListToPlay = listToPlay.filter(
      (video) => !songsToRemove.includes(video.id)
    );

    // update playingPlaylists
    const updatedPlayingPlaylists = playingPlaylists.filter(
      (playlistId) => !playlistsToRemove.includes(playlistId)
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

// -----------------------------------------------
// videos
// -----------------------------------------------
/**
 * Add fetched video to Redux store
 * @param {object} params
 * @param {object} params.video An object of video id and items from YouTube Data API
 * @returns {function} Thunk function
 */
export const addVideo = ({ video: videoToAdd }) => {
  return (dispatch, getState) => {
    const { videos: prevVideos } = getState().ytplaylist;
    const isVideoExists = prevVideos.some(
      (video) => video.id === videoToAdd.id
    );

    // return if video exists
    if (isVideoExists) {
      return;
    }

    const updatedVideos = [...prevVideos, videoToAdd];

    dispatch({
      type: ADD_VIDEO,
      payload: {
        updatedVideos,
      },
    });
  };
};

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
 * @returns SET_CHECKED_VIDEOS action object for redux store
 */
export const setCheckedVideos = (checkedVideos) => ({
  type: SET_CHECKED_VIDEOS,
  payload: {
    checkedVideos,
  },
});

/**
 * Add videos specified by videoIds array to playingVideos
 *
 * @param {Array<string>} videoIds Videos id array
 * @returns {function} Thunk function for redux store
 */
export const addPlayingVideos = (videoIds) => {
  return (dispatch, getState) => {
    const { playingVideos } = getState().ytplaylist;

    const updatedPlayingVideos = union(playingVideos, videoIds);

    dispatch({
      type: ADD_PLAYING_VIDEOS,
      payload: {
        playingVideos: updatedPlayingVideos,
      },
    });
  };
};

/**
 * Remove videos specified by videoIds array from playingVideos
 *
 * @param {*} videoIds Videos id to remove array
 * @returns {function} Thunk function for redux store
 * @returns
 */
export const removePlayingVideos = (videoIds) => {
  return (dispatch, getState) => {
    const { playingVideos } = getState().ytplaylist;

    console.log(playingVideos);

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
      dispatch(addPlayingVideos([id]));
    }

    dispatch(updateListToPlay(updatedListToPlay));
  };
};

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

      dispatch(addPlayingVideos(newPlayingVideos));
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

/**
 * Update listToPlay with updatedList supplied
 *
 * @param {Array<*>} updatedList Updated array of listToPlay
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
