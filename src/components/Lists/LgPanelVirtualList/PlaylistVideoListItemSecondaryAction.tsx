import { DeleteItemButton } from "components/Buttons";
import { makeToggleItemToListToPlaySwitch } from "components/Switches";
import React, { useMemo } from "react";
import { PlaylistItemSnippet, VideoItemSnippet } from "store/ytplaylist/types";
import { isPlaylistItemSnippet } from "store/ytplaylist/utils";
import { useDeletePlaylistItem } from "utils/hooks/playlistsHooks";
import { useDeleteVideoById } from "utils/hooks/videosHooks";

export interface PlaylistVideoListItemSecondaryActionProps {
  itemId: string;
  snippet: PlaylistItemSnippet | VideoItemSnippet;
}

const PlaylistVideoListItemSecondaryAction = (
  props: PlaylistVideoListItemSecondaryActionProps
) => {
  const { itemId, snippet } = props;
  const { handleDeletePlaylistItem } = useDeletePlaylistItem(itemId);
  const { handleDeleteVideoById } = useDeleteVideoById(itemId);

  // Switch component which depends on the sourceType
  const ToggleItemToListToPlaySwitch = useMemo(
    () =>
      makeToggleItemToListToPlaySwitch(
        isPlaylistItemSnippet(snippet) ? "playlists" : "videos"
      ),
    [snippet]
  );

  return (
    <div>
      <ToggleItemToListToPlaySwitch itemId={itemId} />
      <DeleteItemButton
        handleOnClick={
          isPlaylistItemSnippet(snippet)
            ? handleDeletePlaylistItem
            : handleDeleteVideoById
        }
      />
    </div>
  );
};

export default PlaylistVideoListItemSecondaryAction;
