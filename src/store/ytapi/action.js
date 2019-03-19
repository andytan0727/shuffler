import { SET_PLAYLIST_ID } from "../../utils/constants/actionConstants";

const setPlaylistId = playlistId => ({
  type: SET_PLAYLIST_ID,
  payload: {
    playlistId
  }
});

export { setPlaylistId };
