import { DeleteItemButton } from "components/Buttons";
import { makeToggleItemToListToPlaySwitch } from "components/Switches";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "store";
import { deletePlaylistItemByIdAction } from "store/ytplaylist/playlistActions";
import { selectPlaylistIdByItemId } from "store/ytplaylist/playlistSelectors";
import { PlaylistItemSnippet, VideoItemSnippet } from "store/ytplaylist/types";
import { isPlaylistItemSnippet } from "store/ytplaylist/utils";
import { deleteVideoByIdAction } from "store/ytplaylist/videoActions";

export interface PlaylistVideoListItemSecondaryActionProps {
  itemId: string;
  snippet: PlaylistItemSnippet | VideoItemSnippet;
}

const PlaylistVideoListItemSecondaryAction = (
  props: PlaylistVideoListItemSecondaryActionProps
) => {
  const { itemId, snippet } = props;
  const dispatch = useDispatch();
  const snippetId = snippet.id!;
  const playlistId = useSelector((state: AppState) =>
    selectPlaylistIdByItemId(state, itemId)
  );

  if (!playlistId)
    throw new Error("Playlist not found with the corresponding itemId.");

  // Switch component which depends on the sourceType
  const ToggleItemToListToPlaySwitch = useMemo(
    () =>
      makeToggleItemToListToPlaySwitch(
        isPlaylistItemSnippet(snippet) ? "playlists" : "videos"
      ),
    [snippet]
  );

  const handleDeleteVideo = useCallback(() => {
    dispatch(deleteVideoByIdAction(snippetId));
  }, [dispatch, snippetId]);

  const handleDeletePlaylistItem = useCallback(() => {
    dispatch(deletePlaylistItemByIdAction(playlistId, itemId));
  }, [dispatch, itemId, playlistId]);

  return (
    <div>
      <ToggleItemToListToPlaySwitch itemId={itemId} />
      <DeleteItemButton
        handleOnClick={
          isPlaylistItemSnippet(snippet)
            ? handleDeletePlaylistItem
            : handleDeleteVideo
        }
      />
    </div>
  );
};

export default PlaylistVideoListItemSecondaryAction;
