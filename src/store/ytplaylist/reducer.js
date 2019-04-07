import produce, { original } from "immer";
import uniqBy from "lodash.uniqby";
import shuffle from "lodash.shuffle";
import {
  ADD_PLAYLIST,
  REMOVE_PLAYLIST,
  SET_CHECKED_PLAYLISTS,
  SHUFFLE_PLAYLIST,
  SET_LOADED_FROM_DB,
  ADD_LIST_TO_PLAY,
  CLEAR_LIST_TO_PLAY,
} from "../../utils/constants/actionConstants";

import { dbPlaylist, dbSongList } from "../../utils/helper/dbHelper";

const initialState = {
  loadedFromDB: false,
  checkedPlaylists: [], // pushed playlistId from checkbox in SavedPlaylist
  playlists: [
    // {
    //   id: "",
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
        alert("No playlist to remove");
        return draft;
      }

      // keep a original copy to prevent isArray error
      const playlistsToRemove = original(draft.checkedPlaylists);

      const updatedPlaylist = draft.playlists.filter(
        (playlist) => !playlistsToRemove.includes(playlist.id)
      );

      draft.playlists = updatedPlaylist;

      // remove from indexedDB as well
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
          if (!draft.playingPlaylists.includes(playlistId)) {
            draft.playingPlaylists.push(playlistId);
          }
        });

        // clear checkedPlaylists as well if the item added was checked
        draft.checkedPlaylists = [];
      } else {
        updatedListToPlay = [...draft.listToPlay, ...listToAdd];
      }

      const uniqueListToPlay = uniqBy(updatedListToPlay, "id");

      draft.listToPlay = uniqueListToPlay;

      if (persist) {
        dbSongList
          .setItem("listToPlay", uniqueListToPlay)
          .then(() =>
            console.log("successfully added listToPlay to songListDB")
          )
          .catch((err) => console.log(err));
      }

      return draft;
    }

    case CLEAR_LIST_TO_PLAY: {
      draft.listToPlay = [];

      // clear playingPlaylists as well
      draft.playingPlaylists = [];

      // clear indexedDB as well
      dbSongList
        .removeItem("listToPlay")
        .then(() =>
          console.log("successfully removed listToPlay in songListDB")
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
