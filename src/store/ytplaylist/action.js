import uniqBy from "lodash.uniqby";
import shuffle from "lodash.shuffle";
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
  TOGGLE_PLAYING_VIDEO,
  REMOVE_VIDEO_FROM_PLAYING,
} from "../../utils/constants/actionConstants";

import { PlaylistDB, SongListDB, VideosDB } from "../../utils/helper/dbHelper";
import { notify } from "../../utils/helper/notifyHelper";
import { addOrRemove } from "../../utils/helper/arrayHelper";

const playlistDB = new PlaylistDB();
const songListDB = new SongListDB();
const videosDB = new VideosDB();

/**
 * Add playlist to Redux store
 * @param {object} playlist A playlist object structured according to YouTube Data Api
 * @param {boolean} persist Persist to indexedDB (Default to true)
 * @returns {function} Thunk function
 */
export const addPlaylist = (playlist, persist = true) => {
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

    // add to indexedDB as well
    if (persist) playlistDB.addPlaylists(updatedPlaylists);
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

    // update playlists and playingPlaylists in indexedDB
    playlistDB.removePlaylists(playlistsToRemove);
    songListDB.updatePlayingPlaylists(updatedPlayingPlaylists);
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

    const renamedPlaylist = updatedPlaylists.filter(
      (playlist) => playlist.id === playlistIdToRename
    )[0];

    dispatch({
      type: RENAME_PLAYLIST,
      payload: {
        updatedPlaylists,
      },
    });

    // update playlists in indexedDB
    playlistDB.updatePlaylist(renamedPlaylist.id, renamedPlaylist);
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
 * @param {boolean} persist Persist to indexedDB
 * @returns {function} Thunk function
 */
export const addPlayingPlaylists = (playlistIdsToAdd, persist) => {
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

    // save to indexedDB
    if (persist) {
      songListDB.updatePlayingPlaylists(updatedPlayingPlaylists);
    }
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

    // save to indexedDB
    // songListDB.updateListToPlay(listToPlay);
    songListDB.updatePlayingPlaylists(updatedPlayingPlaylists);
  };
};

// -----------------------------------------------
// videos
// -----------------------------------------------
/**
 * Add fetched video to Redux store
 * @param {object} params
 * @param {boolean} params.persist Persist to indexedDB
 * @param {object} params.video An object of video id and items from YouTube Data API
 * @returns {function} Thunk function
 */
export const addVideo = ({ persist, video: videoToAdd }) => {
  return (dispatch, getState) => {
    const { videos: prevVideos } = getState().ytplaylist;
    const isVideoExists = prevVideos.some(
      (video) => video.id === videoToAdd.id
    );

    // return if video exists
    if (isVideoExists) {
      return;
    }

    // if the video is unique then assign it to redux store
    const updatedVideos = !persist
      ? [...prevVideos, videoToAdd]
      : [
          ...prevVideos,
          {
            ...videoToAdd,
            saved: true,
          },
        ];

    dispatch({
      type: ADD_VIDEO,
      payload: {
        updatedVideos,
      },
    });

    // add to indexedDB as well
    if (persist) {
      videosDB.addVideos(updatedVideos);
    }
  };
};

/**
 * Remove checked video in checkedVideos array
 * @returns {function} Thunk function
 */
export const removeVideo = () => {
  return (dispatch, getState) => {
    const {
      checkedVideos: videosToRemove,
      videos,
      playingVideos,
    } = getState().ytplaylist;
    if (!videosToRemove.length) {
      return;
    }

    const updatedVideos = videos.filter(
      (video) => !videosToRemove.includes(video.id)
    );
    const updatedPlayingVideos = playingVideos.filter(
      (videoId) => !videosToRemove.includes(videoId)
    );

    dispatch({
      type: REMOVE_VIDEO,
      payload: {
        updatedVideos,
        updatedPlayingVideos,
      },
    });

    // save to indexedDB
    videosToRemove.forEach((videoId) => {
      videosDB.removeVideo(videoId);
    });
    songListDB.updatePlayingVideos(updatedPlayingVideos);
  };
};

/**
 * Delete ONE video from saved videos
 *
 * @param {string} id Id for video to be deleted
 * @returns {function} Thunk function
 */
export const deleteVideo = (id) => {
  return (dispatch, getState) => {
    const { videos, playingVideos, listToPlay } = getState().ytplaylist;

    // updates videos array
    const updatedVideos = videos.filter((video) => video.id !== id);

    // updates playingVideos if video exists
    const updatedPlayingVideos = playingVideos.filter(
      (videoId) => videoId !== id
    );

    // updates listToPlay
    const updatedListToPlay = listToPlay.filter((video) => video.id !== id);

    dispatch({
      type: DELETE_VIDEO,
      payload: {
        videos: updatedVideos,
        playingVideos: updatedPlayingVideos,
      },
    });
    dispatch(updateListToPlay(updatedListToPlay));

    // updates indexedDB
    videosDB.removeVideo(id);
    songListDB.updatePlayingVideos(updatedPlayingVideos);
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
 * Add videos in listToPlay to playingVideos array
 *
 * @param {Array<string>} videosId Videos id array
 * @param {boolean} persist Persist to indexedDB
 * @returns {function} Thunk function for redux store
 */
export const addPlayingVideos = (videosId, persist) => {
  return (dispatch, getState) => {
    const { playingVideos } = getState().ytplaylist;
    const filteredVideoIds = videosId.filter(
      (id) => !playingVideos.includes(id)
    );
    const updatedPlayingVideos = [...playingVideos, ...filteredVideoIds];

    dispatch({
      type: ADD_PLAYING_VIDEOS,
      payload: {
        updatedPlayingVideos,
      },
    });

    // save to indexedDB
    if (persist) {
      songListDB.updatePlayingVideos(updatedPlayingVideos);
    }
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

    const updatedPlayingVideos = addOrRemove(playingVideos, id);
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
      payload: {
        playingVideos: updatedPlayingVideos,
      },
    });
    dispatch(updateListToPlay(updatedListToPlay));

    songListDB.updatePlayingVideos(updatedPlayingVideos);
  };
};

/**
 * Add playlists/videos to listToPlay
 * @param {object} params
 * @param {boolean} params.checked Use checkedPlaylists/checkedVideos in Redux store if true
 * @param {boolean} params.persist Persist to indexedDB
 * @param {Array<string>} params.listToAdd An array of video to add
 * @returns Thunk function
 */
export const addListToPlay = ({ checked, persist, listToAdd }) => {
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
        if (!playingPlaylists.includes(playlistId)) {
          playingPlaylists.push(playlistId);
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
        if (!playingVideos.includes(videoId)) {
          playingVideos.push(videoId);
        }
      });

      checkedListToClear = "video";
    } else {
      // for hydration
      updatedListToPlay = [...listToPlay, ...listToAdd];
    }

    const uniqueListToPlay = uniqBy(updatedListToPlay, "id");

    dispatch({
      type: ADD_LIST_TO_PLAY,
      payload: {
        updatedPlayingPlaylists: playingPlaylists,
        updatedPlayingVideos: playingVideos,
        checkedListToClear,
      },
    });
    dispatch(updateListToPlay(uniqueListToPlay, persist));

    if (persist) {
      songListDB.updatePlayingPlaylists(playingPlaylists);
      songListDB.updatePlayingVideos(playingVideos);
    }
  };
};

/**
 * Update listToPlay with updatedList supplied
 *
 * @param {Array<*>} updatedList Updated array of listToPlay
 * @param {boolean} persist Persist to indexedDB
 * @returns {function} Thunk function for redux store
 */
export const updateListToPlay = (updatedList, persist = true) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_LIST_TO_PLAY,
      payload: {
        listToPlay: updatedList,
      },
    });

    if (persist) songListDB.updateListToPlay(updatedList);
  };
};

/**
 * Clear current playing playlist
 * @returns {function} Thunk function for redux store
 */
export const clearListToPlay = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_LIST_TO_PLAY,
    });

    // clear listToPlay, playingPlaylists and playingVideos in indexedDB
    songListDB.removeListToPlay();
    songListDB.removePlayingPlaylists();
    songListDB.removePlayingVideos();
  };
};

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

    if (filteredVideosToRemove.length === 0) {
      dispatch(setCheckedVideos([]));
      return;
    }

    // proceed to update listToPlay and playingVideos
    // if filteredVideosToRemove is not empty
    const updatedListToPlay = listToPlay.filter(
      (video) => !filteredVideosToRemove.includes(video.id)
    );
    const updatedPlayingVideos = playingVideos.filter(
      (videoId) => !filteredVideosToRemove.includes(videoId)
    );

    dispatch({
      type: REMOVE_VIDEO_FROM_PLAYING,
      payload: {
        updatedPlayingVideos,
      },
    });
    dispatch(updateListToPlay(updatedListToPlay));
    dispatch(setCheckedVideos([]));

    notify("success", "Successfully removed selected video(s) from playing 😎");

    // save to indexedDB
    songListDB.updatePlayingVideos(updatedPlayingVideos);
  };
};
