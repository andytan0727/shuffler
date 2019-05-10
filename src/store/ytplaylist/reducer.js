import produce, { original } from "immer";
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
  CLEAR_LIST_TO_PLAY,
  ADD_PLAYING_PLAYLISTS,
  REMOVE_PLAYLIST_FROM_PLAYING,

  // videos
  ADD_VIDEO,
  REMOVE_VIDEO,
  SET_CHECKED_VIDEOS,
  ADD_PLAYING_VIDEOS,
  REMOVE_VIDEO_FROM_PLAYING,
} from "../../utils/constants/actionConstants";

import { dbPlaylist, dbSongList, dbVideos } from "../../utils/helper/dbHelper";

const initialState = {
  loadedFromDB: false,
  checkedPlaylists: [], // pushed playlistId from selected playlists
  checkedVideos: [], // pushed videoId from checkbox
  playlists: [
    // {
    //   id: "",
    //   name: "",
    //   items: [{}]
    // }
  ],
  videos: [
    // {
    //   id: "",
    //   items: [{}]
    // }
  ],
  listToPlay: [],
  playingPlaylists: [], // id array storing playlists added to playing list
  playingVideos: [], // [ id1, id2, id3 ]
};

export const ytplaylist = produce((draft, action) => {
  switch (action.type) {
    case SET_LOADED_FROM_DB: {
      draft.loadedFromDB = true;
      return draft;
    }

    case ADD_PLAYLIST: {
      const prevPlaylists = original(draft.playlists);
      const playlistToAdd = action.payload.playlist;
      const persist = action.payload.persist;
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

      draft.playlists = updatedPlaylists;

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

      return draft;
    }

    case REMOVE_PLAYLIST: {
      if (!draft.checkedPlaylists.length) {
        return draft;
      }

      // keep a original copy to prevent isArray error
      const playlistsToRemove = original(draft.checkedPlaylists);

      const updatedPlaylist = draft.playlists.filter(
        (playlist) => !playlistsToRemove.includes(playlist.id)
      );

      // also check playingPlaylists
      const updatedPlayingPlaylists = draft.playingPlaylists.filter(
        (playlistId) => !playlistsToRemove.includes(playlistId)
      );

      // update playlists, playingPlaylists and checkedPlaylists
      draft.playlists = updatedPlaylist;
      draft.playingPlaylists = updatedPlayingPlaylists;
      draft.checkedPlaylists = [];

      // update playlists array with removed playlists from indexedDB
      playlistsToRemove.forEach((playlistId) => {
        dbPlaylist
          .removeItem(playlistId)
          .then(() =>
            console.log(`successfully removed playlist-${playlistId}`)
          )
          .catch((err) =>
            console.log("Error in removing playlist from indexedDB")
          );
      });

      // update playingPlaylists with removed playlists in indexedDB
      dbSongList
        .setItem("playingPlaylists", updatedPlayingPlaylists)
        .then(() =>
          console.log(
            "successfully remove removed playlists in playingPlaylists"
          )
        );

      return draft;
    }

    case RENAME_PLAYLIST: {
      const newName = action.payload.newName;
      const playlistIdToRename = action.payload.playlistId;
      const playlists = original(draft.playlists);
      const updatedPlaylists = playlists.map((playlist) => {
        if (playlist.id === playlistIdToRename) {
          playlist.name = newName;
        }
        return playlist;
      });

      const renamedPlaylist = updatedPlaylists.filter(
        (playlist) => playlist.id === playlistIdToRename
      )[0];

      // reassign playlists
      draft.playlists = updatedPlaylists;

      // update playlists in indexedDB
      dbPlaylist
        .setItem(renamedPlaylist.id, renamedPlaylist)
        .then(() => console.log("successfully saved renamed playlist"));

      return draft;
    }

    case SET_CHECKED_PLAYLISTS: {
      draft.checkedPlaylists = action.payload.checkedPlaylists;

      return draft;
    }

    case ADD_PLAYING_PLAYLISTS: {
      const persist = action.payload.persist;
      const filteredPlaylistIds = action.payload.playlists.filter(
        (id) => !draft.playingPlaylists.includes(id)
      );
      const playingPlaylists = [
        ...draft.playingPlaylists,
        ...filteredPlaylistIds,
      ];

      // update playingPlaylists in redux
      draft.playingPlaylists = playingPlaylists;

      // save to indexedDB
      if (persist) {
        dbSongList
          .setItem("playingPlaylists", playingPlaylists)
          .then(() => console.log("successfully saved playingPlaylists"))
          .catch((err) => console.error(err));
      }

      return draft;
    }

    case REMOVE_PLAYLIST_FROM_PLAYING: {
      if (!draft.checkedPlaylists.length) {
        return draft;
      }

      const playlistsToRemove = original(draft.checkedPlaylists);

      const songsToRemove = original(draft.playlists)
        .filter((playlist) => playlistsToRemove.includes(playlist.id))
        .flatMap((filteredPlaylist) => filteredPlaylist.items)
        .flatMap((filteredItem) => filteredItem.id);

      // update listToPlay
      const updatedListToPlay = original(draft.listToPlay).filter(
        (video) => !songsToRemove.includes(video.id)
      );

      // // update playingPlaylists
      const updatedPlayingPlaylists = original(draft.playingPlaylists).filter(
        (playlistId) => !playlistsToRemove.includes(playlistId)
      );

      // // update redux
      draft.listToPlay = updatedListToPlay;
      draft.playingPlaylists = updatedPlayingPlaylists;
      draft.checkedPlaylists = [];

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

      return draft;
    }

    // ------------------------------------------
    // videos
    // ------------------------------------------
    case ADD_VIDEO: {
      const prevVideos = original(draft.videos);
      const videoToAdd = action.payload.video;
      const persist = action.payload.persist;
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

      draft.videos = updatedVideos;

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

      return draft;
    }

    case REMOVE_VIDEO: {
      if (!draft.checkedVideos.length) {
        return draft;
      }

      const videosToRemove = original(draft.checkedVideos);
      const updatedVideos = draft.videos.filter(
        (video) => !videosToRemove.includes(video.id)
      );
      const updatedPlayingVideos = draft.playingVideos.filter(
        (videoId) => !videosToRemove.includes(videoId)
      );

      // update videos, playingVideos and checkedVideos
      draft.videos = updatedVideos;
      draft.playingVideos = updatedPlayingVideos;
      draft.checkedVideos = [];

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

      return draft;
    }

    case SET_CHECKED_VIDEOS: {
      draft.checkedVideos = action.payload.checkedVideos;
      return draft;
    }

    case ADD_PLAYING_VIDEOS: {
      const persist = action.payload.persist;
      const filteredVideoIds = action.payload.videosId.filter(
        (id) => !draft.playingVideos.includes(id)
      );
      const updatedPlayingVideos = [
        ...draft.playingVideos,
        ...filteredVideoIds,
      ];

      // update playingVideos in redux
      draft.playingVideos = updatedPlayingVideos;

      // save to indexedDB
      if (persist) {
        dbSongList
          .setItem("playingVideos", updatedPlayingVideos)
          .then(() => console.log("successfully saved playingVideos"))
          .catch((err) => console.error(err));
      }

      return draft;
    }

    case REMOVE_VIDEO_FROM_PLAYING: {
      if (!draft.checkedVideos.length) {
        return draft;
      }

      const videosToRemove = original(draft.checkedVideos);

      // update listToPlay
      const updatedListToPlay = original(draft.listToPlay).filter(
        (video) => !videosToRemove.includes(video.id)
      );

      // // update playingVideos
      const updatedPlayingVideos = original(draft.playingVideos).filter(
        (videoId) => !videosToRemove.includes(videoId)
      );

      // // update redux
      draft.listToPlay = updatedListToPlay;
      draft.playingVideos = updatedPlayingVideos;
      draft.checkedVideos = [];

      // save to indexedDB
      // save listToPlay
      dbSongList
        .setItem("listToPlay", updatedListToPlay)
        .then(() => console.log("successfully added listToPlay to songListDB"))
        .catch((err) => console.error(err));

      // save playingVideos
      dbSongList
        .setItem("playingVideos", updatedPlayingVideos)
        .then(() =>
          console.log("successfully saved playingVideos to songListDB")
        )
        .catch((err) => console.error(err));

      return draft;
    }

    // ------------------------------------------
    // list to play / playingList
    // ------------------------------------------
    case ADD_LIST_TO_PLAY: {
      const listToAdd = action.payload.listToAdd;
      const persist = action.payload.persist;
      const checked = action.payload.checked;
      const playingPlaylists = original(draft.playingPlaylists);
      const playingVideos = original(draft.playingVideos);
      let updatedListToPlay;

      // add playlists
      if (checked && !draft.checkedVideos.length) {
        updatedListToPlay = [
          ...draft.listToPlay,
          ...draft.playlists
            .filter((playlist) => draft.checkedPlaylists.includes(playlist.id))
            .flatMap((filteredPlaylist) => filteredPlaylist.items),
        ];

        // push chosen playlists' id to playingPlaylists array
        draft.checkedPlaylists.forEach((playlistId) => {
          if (!playingPlaylists.includes(playlistId)) {
            playingPlaylists.push(playlistId);
          }
        });

        draft.checkedPlaylists = [];

        // add videos
      } else if (checked && !draft.checkedPlaylists.length) {
        updatedListToPlay = [
          ...draft.listToPlay,
          ...draft.videos
            .filter((video) => draft.checkedVideos.includes(video.id))
            .flatMap((filteredVideo) => filteredVideo.items),
        ];

        // push chosen videos' id to playingVideos array
        draft.checkedVideos.forEach((videoId) => {
          if (!playingVideos.includes(videoId)) {
            playingVideos.push(videoId);
          }
        });

        draft.checkedVideos = [];
      } else {
        // for hydration
        updatedListToPlay = [...draft.listToPlay, ...listToAdd];
      }

      const uniqueListToPlay = uniqBy(updatedListToPlay, "id");

      draft.listToPlay = uniqueListToPlay;
      draft.playingPlaylists = playingPlaylists;
      draft.playingVideos = playingVideos;

      if (persist) {
        // save listToPlay
        dbSongList
          .setItem("listToPlay", uniqueListToPlay)
          .then(() =>
            console.log("successfully added listToPlay to songListDB")
          )
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

      return draft;
    }

    case CLEAR_LIST_TO_PLAY: {
      // clear listToPlay
      draft.listToPlay = [];

      // clear playingPlaylists and playingVideos as well
      draft.playingPlaylists = [];
      draft.playingVideos = [];

      // clear listToPlay, playingPlaylists and playingVideos in indexedDB as well
      dbSongList
        .removeItem("listToPlay")
        .then(() =>
          console.log("successfully removed listToPlay in songListDB")
        );

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

      return draft;
    }

    case SHUFFLE_PLAYLIST: {
      if (draft.listToPlay.length) {
        draft.listToPlay = shuffle(draft.listToPlay);

        // add to indexedDB as well
        dbSongList
          .setItem("listToPlay", draft.listToPlay)
          .then(() => console.log("add shuffled listToPlay to songListDB"))
          .catch((err) => console.error(err));
      }

      return draft;
    }

    default: {
      return draft;
    }
  }
}, initialState);
