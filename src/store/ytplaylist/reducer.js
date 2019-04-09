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
} from "../../utils/constants/actionConstants";

import { dbPlaylist, dbSongList } from "../../utils/helper/dbHelper";

const initialState = {
  loadedFromDB: false,
  checkedPlaylists: [], // pushed playlistId from checkbox in SavedPlaylist
  playlists: [
    // {
    //   id: "",
    //   name: "",
    //   items: [{}]
    // }
  ],
  listToPlay: [],
  playingPlaylists: [], // id array storing playlists added to playing list
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

      // update playlists and playingPlaylists
      draft.playlists = updatedPlaylist;
      draft.playingPlaylists = updatedPlayingPlaylists;

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
      if (!draft.checkedPlaylists.length || draft.checkedPlaylists.length > 1) {
        return draft;
      }

      const newName = action.payload.newName;
      const playlists = original(draft.playlists);
      playlists.forEach((playlist) => {
        if (playlist.id === draft.checkedPlaylists[0]) {
          playlist.name = newName;
        }
      });

      const renamedPlaylist = playlists.filter(
        (playlist) => playlist.id === draft.checkedPlaylists[0]
      )[0];

      // reassign playlists and clear checkedPlaylists
      draft.playlists = playlists;
      draft.checkedPlaylists = [];

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

    case ADD_LIST_TO_PLAY: {
      const listToAdd = action.payload.listToAdd;
      const persist = action.payload.persist;
      const checked = action.payload.checked;
      const playingPlaylists = original(draft.playingPlaylists);
      let updatedListToPlay;

      // make sure only add unique song
      if (checked) {
        updatedListToPlay = [
          ...draft.listToPlay,
          ...draft.playlists
            .filter((playlist) => draft.checkedPlaylists.includes(playlist.id))
            .flatMap((filteredPlaylist) => filteredPlaylist.items),
        ];

        // push playlists' id to playingPlaylists array
        draft.checkedPlaylists.forEach((playlistId) => {
          if (!playingPlaylists.includes(playlistId)) {
            playingPlaylists.push(playlistId);
          }
        });

        // clear checkedPlaylists as well if the item added was checked
        draft.checkedPlaylists = [];
      } else {
        updatedListToPlay = [...draft.listToPlay, ...listToAdd];
      }

      const uniqueListToPlay = uniqBy(updatedListToPlay, "id");

      draft.listToPlay = uniqueListToPlay;
      draft.playingPlaylists = playingPlaylists;

      if (persist) {
        // save listToPlay
        dbSongList
          .setItem("listToPlay", uniqueListToPlay)
          .then(() =>
            console.log("successfully added listToPlay to songListDB")
          )
          .catch((err) => console.log(err));

        // save playingPlaylists
        dbSongList
          .setItem("playingPlaylists", playingPlaylists)
          .then(() =>
            console.log("successfully saved playingPlaylists to songListDB")
          );
      }

      return draft;
    }

    case ADD_PLAYING_PLAYLISTS: {
      const playlistIds = action.payload.playlists;
      draft.playingPlaylists = playlistIds;
      return draft;
    }

    case CLEAR_LIST_TO_PLAY: {
      // clear listToPlay
      draft.listToPlay = [];

      // clear playingPlaylists as well
      draft.playingPlaylists = [];

      // clear listToPlay and playingPlaylists in indexedDB as well
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
