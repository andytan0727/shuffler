import React, { useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { DeleteItemButton } from "components/Buttons";
import { makeToggleItemToListToPlaySwitch } from "components/Switches";

import {
  deleteNormVideoByIdAction,
  deleteNormPlaylistItemByIdAction,
} from "store/ytplaylist/normAction";
import { PlaylistItemSnippet, VideoItemSnippet } from "store/ytplaylist/types";
import { isPlaylistItemSnippet } from "store/ytplaylist/utils";

// backward-compat
import { deleteVideosAction } from "store/ytplaylist/action";

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

  // Switch component which depends on the sourceType
  const ToggleItemToListToPlaySwitch = useMemo(
    () =>
      makeToggleItemToListToPlaySwitch(
        isPlaylistItemSnippet(snippet) ? "playlists" : "videos"
      ),
    [snippet]
  );

  const handleDeleteVideo = useCallback(() => {
    dispatch(deleteNormVideoByIdAction(snippetId));

    // backward-compatible support
    dispatch(deleteVideosAction([snippetId]));
  }, [dispatch, snippetId]);

  const handleDeletePlaylistItem = useCallback(() => {
    dispatch(
      deleteNormPlaylistItemByIdAction(
        (snippet as PlaylistItemSnippet).playlistId,
        itemId
      )
    );
  }, [dispatch, snippet, itemId]);

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
