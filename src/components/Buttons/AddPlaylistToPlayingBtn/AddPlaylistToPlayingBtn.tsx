import React from "react";
import { useAddPlaylistToPlaying } from "utils/hooks/playlistsHooks";

import { IconButton, Tooltip } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";

interface AddPlaylistToPlayingBtnProps {
  playlistId: string;
  iconSize?: "inherit" | "small" | "large" | "default" | undefined;
}

const AddPlaylistToPlayingBtn = (props: AddPlaylistToPlayingBtnProps) => {
  const { playlistId, iconSize } = props;

  const { handleAddPlaylistToPlaying } = useAddPlaylistToPlaying([playlistId]);

  return (
    <Tooltip title="Add Playlist to Now Playing">
      <IconButton onClick={handleAddPlaylistToPlaying}>
        <AddIcon fontSize={iconSize} />
      </IconButton>
    </Tooltip>
  );
};

export default AddPlaylistToPlayingBtn;
