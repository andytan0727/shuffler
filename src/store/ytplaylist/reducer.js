import produce from "immer";
import uniqBy from "lodash.uniqby";
import {
  ADD_PLAYLIST,
  SHUFFLE_PLAYLIST
} from "../../utils/constants/actionConstants";
import shuffle from "lodash.shuffle";

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
      return draft;
    }

    case SHUFFLE_PLAYLIST: {
      const songToShuffle = draft.playlists
        .map(playlist => playlist.items)
        .reduce((acc, curSong) => acc.concat(curSong));

      draft.listToPlay = shuffle(songToShuffle);

      return draft;
    }

    default: {
      return draft;
    }
  }
}, initialState);
