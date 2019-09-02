import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addPlaylistToListToPlayAction } from "store/ytplaylist/playlistActions";
import { noPlaylistProvidedAlert, notify } from "utils/helper/notifyHelper";

/**
 * Simple hooks that provide handler function to
 * add playlist to playing based on playlistIds array
 * provided
 *
 * @param playlistIds PlaylistIds array to add
 * @returns Object containing handler function
 */
export const useAddPlaylistToPlaying = (playlistIds: string[]) => {
  const dispatch = useDispatch();

  const handleAddPlaylistToPlaying = useCallback(async () => {
    if (!playlistIds.length) {
      await noPlaylistProvidedAlert();
      return;
    }

    for (const playlistId of playlistIds) {
      dispatch(addPlaylistToListToPlayAction(playlistId));
    }

    notify("success", "Added playlist(s) to Now Playing");
  }, [dispatch, playlistIds]);

  return {
    handleAddPlaylistToPlaying,
  };
};
