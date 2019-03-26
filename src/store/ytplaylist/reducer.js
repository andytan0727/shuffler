import produce from "immer";
import uniqBy from "lodash.uniqby";
import shuffle from "lodash.shuffle";
import {
  ADD_PLAYLIST,
  SHUFFLE_PLAYLIST,
  SET_LOADED_FROM_DB
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
      const playlistToAdd = action.payload.playlist;
      const persist = action.payload.persist;
      const isPlaylistExists = draft.playlists.some(
        playlist => playlist.id === playlistToAdd.id
      );

      // return if playlist exists
      if (isPlaylistExists) {
        return;
      }

      // if the playlist is unique then assign it to redux store
      const updatedPlaylists = [...draft.playlists, playlistToAdd];
      const updatedListToPlay = uniqBy(
        [...draft.listToPlay, ...playlistToAdd.items],
        "id"
      );
      draft.playlists = updatedPlaylists;

      // make sure only add unique song
      draft.listToPlay = updatedListToPlay;

      // add to indexedDB as well
      if (persist) {
        updatedPlaylists.forEach(playlist => {
          dbPlaylist
            .setItem(playlist.id, playlist)
            .then(() =>
              console.log(
                `successfully added playlist-${playlist.id} to playlistDB`
              )
            )
            .catch(err => console.error(err));
        });

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
