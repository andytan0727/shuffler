import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { removePlaylistsFromListToPlayAction } from "store/ytplaylist/playlistActions";
import { noPlaylistProvidedAlert, notify } from "utils/helper/notifyHelper";

/**
 * Simple hooks that provide handler function to
 * remove playlist from playing based on playlistIds array
 * provided
 *
 * @param playlistIds PlaylistIds array of playlists to remove
 * @returns Object containing handler function
 */
export const useRemovePlaylistFromPlaying = (playlistIds: string[]) => {
  const dispatch = useDispatch();

  const handleRemovePlaylistFromPlaying = useCallback(async () => {
    if (!playlistIds.length) {
      await noPlaylistProvidedAlert();
      return;
    }

    dispatch(removePlaylistsFromListToPlayAction(playlistIds));

    notify("success", "Removed playlist(s) from Now Playing");
  }, [dispatch, playlistIds]);

  return {
    handleRemovePlaylistFromPlaying,
  };
};
