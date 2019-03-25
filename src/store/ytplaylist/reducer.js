import produce from "immer";
import uniqBy from "lodash.uniqby";
import shuffle from "lodash.shuffle";
import {
  ADD_PLAYLIST,
  SHUFFLE_PLAYLIST
} from "../../utils/constants/actionConstants";

import { dbPlaylist, dbSongList } from "../../utils/helper/dbHelper";

const initialState = {
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
    case ADD_PLAYLIST: {
      const playlistToAdd = action.payload.playlist;
      const isPlaylistExists = draft.playlists.some(
        playlist => playlist.id === playlistToAdd.id
      );

      // return if playlist exists
      if (isPlaylistExists) {
        return;
      }

      // if the playlist is unique then push it to redux store
      draft.playlists.push(playlistToAdd);
      draft.listToPlay.push(...playlistToAdd.items);

      // make sure only add unique song
      draft.listToPlay = uniqBy(draft.listToPlay, "id");

      // add to indexedDB as well
      draft.playlists.forEach(playlist => {
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
        .setItem("listToPlay", draft.listToPlay)
        .then(() => console.log("successfully added listToPlay to songListDB"))
        .catch(err => console.log(err));

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
