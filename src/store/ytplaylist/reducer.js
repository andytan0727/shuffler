import produce, { original } from "immer";
import uniqBy from "lodash.uniqby";
import shuffle from "lodash.shuffle";
import {
  ADD_PLAYLIST,
  SHUFFLE_PLAYLIST,
  SET_LOADED_FROM_DB,
  ADD_LIST_TO_PLAY
} from "../../utils/constants/actionConstants";

import { dbPlaylist, dbSongList } from "../../utils/helper/dbHelper";

const initialState = {
  loadedFromDB: false,
  playlists: [
    // {
    //   id: "",
    //   items: [{}]
    // }
  ],
  listToPlay: []
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
        playlist => playlist.id === playlistToAdd.id
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
              saved: true
            }
          ];

      draft.playlists = updatedPlaylists;

      // add to indexedDB as well
      if (persist) {
        console.log(updatedPlaylists);
        updatedPlaylists.forEach(playlist => {
          dbPlaylist
            .setItem(playlist.id, playlist)
            .then(() => {
              console.log(
                `successfully added playlist-${playlist.id} to playlistDB`
              );
            })
            .catch(err => console.error(err));
        });
      }

      return draft;
    }

    case ADD_LIST_TO_PLAY: {
      const listToAdd = action.payload.listToAdd;
      const persist = action.payload.persist;

      // make sure only add unique song
      const updatedListToPlay = uniqBy(
        [...draft.listToPlay, ...listToAdd],
        "id"
      );
      draft.listToPlay = updatedListToPlay;

      if (persist) {
        dbSongList
          .setItem("listToPlay", updatedListToPlay)
          .then(() =>
            console.log("successfully added listToPlay to songListDB")
          )
          .catch(err => console.log(err));
      }

      return draft;
    }

    case SHUFFLE_PLAYLIST: {
      if (draft.listToPlay.length) {
        draft.listToPlay = shuffle(draft.listToPlay);

        // add to indexedDB as well
        dbSongList
          .setItem("listToPlay", draft.listToPlay)
          .then(() => console.log("add shuffled listToPlay to songListDB"))
          .catch(err => console.error(err));
      }

      return draft;
    }

    default: {
      return draft;
    }
  }
}, initialState);
