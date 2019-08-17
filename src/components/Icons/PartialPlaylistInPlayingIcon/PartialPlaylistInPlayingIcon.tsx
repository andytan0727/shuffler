import React from "react";

import { Tooltip } from "@material-ui/core";
import { MusicNote as MusicNoteIcon } from "@material-ui/icons";

const PartialPlaylistInPlayingIcon = () => {
  return (
    <Tooltip title="Partially in Now Playing">
      <MusicNoteIcon />
    </Tooltip>
  );
};

export default PartialPlaylistInPlayingIcon;
