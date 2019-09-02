import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { syncPlaylistFromYTByIdAction } from "store/ytplaylist/playlistActions";

/**
 * Simple hooks that provide handler function to
 * sync playlist from YouTube based on playlistId
 * provided
 *
 * @param playlistId PlaylistId of playlist to sync
 * @returns Object containing handler function
 */
export const useSyncPlaylist = (playlistId: string) => {
  const dispatch = useDispatch();

  // sync playlist by fetching latest data from upstream (YouTube)
  const handleSyncPlaylist = useCallback(async () => {
    dispatch(syncPlaylistFromYTByIdAction(playlistId));
  }, [dispatch, playlistId]);

  return {
    handleSyncPlaylist,
  };
};
