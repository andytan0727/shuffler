import uniqBy from "lodash.uniqby";
import shuffle from "lodash.shuffle";
import {
  ADD_PLAYLIST,
  REMOVE_PLAYLIST,
  RENAME_PLAYLIST,
  SET_CHECKED_PLAYLISTS,
  SHUFFLE_PLAYLIST,
  SET_LOADED_FROM_DB,
  ADD_LIST_TO_PLAY,
  ADD_PLAYING_PLAYLISTS,
  CLEAR_LIST_TO_PLAY,
  REMOVE_PLAYLIST_FROM_PLAYING,

  // videos
  ADD_VIDEO,
  REMOVE_VIDEO,
  SET_CHECKED_VIDEOS,
  ADD_PLAYING_VIDEOS,
  REMOVE_VIDEO_FROM_PLAYING,
} from "../../utils/constants/actionConstants";

import { dbPlaylist, dbSongList, dbVideos } from "../../utils/helper/dbHelper";
import { notify } from "../../utils/helper/notifyHelper";

/**
 * Add fetched playlist items to Redux store
 * @param {boolean} persist persist to indexedDB
 * @param {object} playlist An object of playlist id and items from YouTube Data API
 * @returns ADD_PLAYLIST thunk function for redux store
 */
const addPlaylist = ({ persist, playlist }) => {
  return (dispatch, getState) => {
    const { playlists: prevPlaylists } = getState().ytplaylist;
    const playlistToAdd = playlist;

    const isPlaylistExists = prevPlaylists.some(
      (playlist) => playlist.id === playlistToAdd.id
    );

    // return if playlist exists
    if (isPlaylistExists) {
      return;
    }

    // if the playlist is unique then assign it to redux store
    const updatedPlaylists = !persist
      ? [...prevPlaylists, playlistToAdd]
      : [
          ...prevPlaylists,
          {
            ...playlistToAdd,
            saved: true,
          },
        ];

    dispatch({
      type: ADD_PLAYLIST,
      payload: {
        updatedPlaylists,
      },
    });

    // add to indexedDB as well
    if (persist) {
      updatedPlaylists.forEach((playlist) => {
        dbPlaylist
          .setItem(playlist.id, playlist)
          .then(() => {
            console.log(
              `successfully added playlist-${playlist.id} to playlistDB`
            );
          })
          .catch((err) => console.error(err));
      });
    }
  };
};

/**
 * Remove checked playlist in checkedPlaylists array
 * @returns REMOVE_PLAYLIST thunk function for redux store
 */
const removePlaylist = () => {
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

    // update playlists array with removed playlists from indexedDB
    playlistsToRemove.forEach((playlistId) => {
      dbPlaylist
        .removeItem(playlistId)
        .then(() => console.log(`successfully removed playlist-${playlistId}`))
        .catch((err) =>
          console.log("Error in removing playlist from indexedDB")
        );
    });

    // update playingPlaylists with removed playlists in indexedDB
    dbSongList
      .setItem("playingPlaylists", updatedPlayingPlaylists)
      .then(() =>
        console.log("successfully remove removed playlists in playingPlaylists")
      );
  };
};

/**
 * Rename selected playlist (one at once)
 *
 * @param {string} newName New name of selected playlist
 * @param {string} playlistIdToRename selected playlist's id
 * @returns RENAME_PLAYLIST thunk function for redux store
 */
const renamePlaylist = (newName, playlistIdToRename) => {
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
    dbPlaylist
      .setItem(renamedPlaylist.id, renamedPlaylist)
      .then(() => console.log("successfully saved renamed playlist"));
  };
};

/**
 * Set checked playlist in Redux store
 * @param {array} checkedPlaylists selected playlists
 * @returns SET_CHECKED_PLAYLISTS action object for redux store
 */
const setCheckedPlaylists = (checkedPlaylists) => ({
  type: SET_CHECKED_PLAYLISTS,
  payload: {
    checkedPlaylists,
  },
});

/**
 * Shuffle fetched playlists into one combined playlist
 * @returns SHUFFLE_PLAYLIST thunk function for redux store
 *
 */
const shufflePlaylist = () => {
  return (dispatch, getState) => {
    const { listToPlay } = getState().ytplaylist;
    let updatedListToPlay;

    if (listToPlay.length) {
      updatedListToPlay = shuffle(listToPlay);

      dispatch({
        type: SHUFFLE_PLAYLIST,
        payload: {
          updatedListToPlay,
        },
      });

      // add to indexedDB as well
      dbSongList
        .setItem("listToPlay", updatedListToPlay)
        .then(() => console.log("add shuffled listToPlay to songListDB"))
        .catch((err) => console.error(err));
    }
  };
};

/**
 * Set loadedFromDB to true if data is persisted and loaded from indexedDB
 * @returns SET_LOADED_FROM_DB action object for redux store
 *
 */
const setLoadedFromDB = () => ({
  type: SET_LOADED_FROM_DB,
});

/**
 * Add playlists in listToPlay to playingPlaylists array
 *
 * @param {array} playlistIdsToAdd playlists' id array
 * @param {boolean} persist persist to indexedDB
 * @returns ADD_PLAYING_PLAYLISTS thunk function for redux store
 */
const addPlayingPlaylists = (playlistIdsToAdd, persist) => {
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
      dbSongList
        .setItem("playingPlaylists", updatedPlayingPlaylists)
        .then(() => console.log("successfully saved playingPlaylists"))
        .catch((err) => console.error(err));
    }
  };
};

/**
 * Remove selected playlist(s) from playingList
 *
 * @returns REMOVE_PLAYLIST_FROM_PLAYING thunk function for redux store
 *
 */
const removePlaylistFromPlaying = () => {
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
        updatedListToPlay,
        updatedPlayingPlaylists,
      },
    });
    dispatch(setCheckedPlaylists([]));

    // save to indexedDB
    // save listToPlay
    dbSongList
      .setItem("listToPlay", updatedListToPlay)
      .then(() => console.log("successfully added listToPlay to songListDB"))
      .catch((err) => console.error(err));

    // save playingPlaylists
    dbSongList
      .setItem("playingPlaylists", updatedPlayingPlaylists)
      .then(() =>
        console.log("successfully saved playingPlaylists to songListDB")
      )
      .catch((err) => console.error(err));
  };
};

// -----------------------------------------------
// videos
// -----------------------------------------------
/**
 * Add fetched video to Redux store
 * @param {boolean} persist persist to indexedDB
 * @param {object} video An object of video id and items from YouTube Data API
 * @returns ADD_VIDEO thunk function for redux store
 */
const addVideo = ({ persist, video: videoToAdd }) => {
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
      updatedVideos.forEach((video) => {
        dbVideos
          .setItem(video.id, video)
          .then(() => {
            console.log(`successfully added video-${video.id} to playlistDB`);
          })
          .catch((err) => console.error(err));
      });
    }
  };
};

/**
 * Remove checked video in checkedVideos array
 * @returns REMOVE_VIDEO thunk function for redux store
 */
const removeVideo = () => {
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

    // update videos with removed vides from indexedDB
    videosToRemove.forEach((videoId) => {
      dbVideos
        .removeItem(videoId)
        .then(() => console.log(`successfully removed video-${videoId}`))
        .catch((err) => console.error(err));
    });

    // update playingVideos with removed videos in indexedDB
    dbSongList
      .setItem("playingVideos", updatedPlayingVideos)
      .then(() =>
        console.log("successfully remove removed videos in playingVideos")
      );
  };
};

/**
 * Set checked videos in Redux store
 * @param {array} checkedVideos checkedVideos array
 * @returns SET_CHECKED_VIDEOS action object for redux store
 */
const setCheckedVideos = (checkedVideos) => ({
  type: SET_CHECKED_VIDEOS,
  payload: {
    checkedVideos,
  },
});

/**
 * Add videos in listToPlay to playingVideos array
 *
 * @param {array} videosId videos id array
 * @param {boolean} persist persist to indexedDB
 * @returns ADD_PLAYING_VIDEOS thunk function for redux store
 */
const addPlayingVideos = (videosId, persist) => {
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
      dbSongList
        .setItem("playingVideos", updatedPlayingVideos)
        .then(() => console.log("successfully saved playingVideos"))
        .catch((err) => console.error(err));
    }
  };
};

/**
 * Add playlists/videos to listToPlay
 * @param {boolean} checked use checkedPlaylists/checkedVideos in Redux store if true
 * @param {boolean} persist persist to indexedDB
 * @param {object} listToAdd An array of video to add

 * @returns ADD_LIST_TO_PLAY thunk function for redux store
 */
const addListToPlay = ({ checked, persist, listToAdd }) => {
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
        updatedListToPlay: uniqueListToPlay,
        updatedPlayingPlaylists: playingPlaylists,
        updatedPlayingVideos: playingVideos,
        checkedListToClear,
      },
    });

    if (persist) {
      // save listToPlay
      dbSongList
        .setItem("listToPlay", uniqueListToPlay)
        .then(() => console.log("successfully added listToPlay to songListDB"))
        .catch((err) => console.error(err));

      // save playingPlaylists
      dbSongList
        .setItem("playingPlaylists", playingPlaylists)
        .then(() =>
          console.log("successfully saved playingPlaylists to songListDB")
        )
        .catch((err) => console.error(err));

      // save playingVideos
      dbSongList
        .setItem("playingVideos", playingVideos)
        .then(() =>
          console.log("successfully saved playingVideos to songListDB")
        );
    }
  };
};

/**
 * Clear current playing playlist
 * @returns CLEAR_LIST_TO_PLAY thunk function for redux store
 */
const clearListToPlay = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_LIST_TO_PLAY,
    });

    // clear listToPlay, playingPlaylists and playingVideos in indexedDB
    dbSongList
      .removeItem("listToPlay")
      .then(() => console.log("successfully removed listToPlay in songListDB"));

    dbSongList
      .removeItem("playingPlaylists")
      .then(() =>
        console.log("successfully removed playingPlaylists in songlistDB")
      );

    dbSongList
      .removeItem("playingVideos")
      .then(() =>
        console.log("successfully removed playingVideos in songlistDB")
      );
  };
};

/**
 * Remove selected video(s) from playingList
 *
 * @returns REMOVE_VIDEO_FROM_PLAYING thunk function for redux store
 *
 */
const removeVideoFromPlaying = () => {
  return (dispatch, getState) => {
    const {
      checkedVideos: videosToRemove,
      listToPlay,
      playingVideos,
    } = getState().ytplaylist;
    if (!videosToRemove.length) {
      return;
    }

    // update listToPlay
    const updatedListToPlay = listToPlay.filter(
      (video) => !videosToRemove.includes(video.id)
    );

    // // update playingVideos
    const updatedPlayingVideos = playingVideos.filter(
      (videoId) => !videosToRemove.includes(videoId)
    );

    dispatch({
      type: REMOVE_VIDEO_FROM_PLAYING,
      payload: {
        updatedListToPlay,
        updatedPlayingVideos,
      },
    });

    // save to indexedDB
    // save listToPlay
    dbSongList
      .setItem("listToPlay", updatedListToPlay)
      .then(() => console.log("successfully added listToPlay to songListDB"))
      .catch((err) => console.error(err));

    // save playingVideos
    dbSongList
      .setItem("playingVideos", updatedPlayingVideos)
      .then(() => console.log("successfully saved playingVideos to songListDB"))
      .catch((err) => console.error(err));
  };
};

export {
  addPlaylist,
  removePlaylist,
  renamePlaylist,
  setCheckedPlaylists,
  shufflePlaylist,
  setLoadedFromDB,
  addListToPlay,
  addPlayingPlaylists,
  clearListToPlay,
  removePlaylistFromPlaying,
  // ------------------------------------
  // videos
  addVideo,
  removeVideo,
  setCheckedVideos,
  addPlayingVideos,
  removeVideoFromPlaying,
};
