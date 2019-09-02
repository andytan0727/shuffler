import React from "react";
import { useRemovePlaylistFromPlaying } from "utils/hooks/playlistsHooks";

import { IconButton, Tooltip } from "@material-ui/core";
import { Remove as RemoveIcon } from "@material-ui/icons";

interface RemovePlaylistFromPlayingBtnProps {
  playlistId: string;
  iconSize?: "inherit" | "small" | "large" | "default" | undefined;
}

const RemovePlaylistFromPlayingBtn = (
  props: RemovePlaylistFromPlayingBtnProps
) => {
  const { playlistId, iconSize } = props;

  const { handleRemovePlaylistFromPlaying } = useRemovePlaylistFromPlaying([
    playlistId,
  ]);

  return (
    <Tooltip title="Remove Playlist from Now Playing">
      <IconButton onClick={handleRemovePlaylistFromPlaying}>
        <RemoveIcon fontSize={iconSize} />
      </IconButton>
    </Tooltip>
  );
};

export default RemovePlaylistFromPlayingBtn;
