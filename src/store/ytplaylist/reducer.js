import produce from "immer";
import { ADD_PLAYLIST } from "../../utils/constants/actionConstants";

const initialState = {
  playlists: [
    // {
    //   id: "",
    //   items: []
    // }
  ]
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
      return draft;
    }

    default: {
      return draft;
    }
  }
}, initialState);
