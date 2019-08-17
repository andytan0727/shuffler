import React from "react";

import { Tooltip } from "@material-ui/core";
import { PlaylistAddCheck as PlaylistAddCheckIcon } from "@material-ui/icons";

const AllPlaylistInPlayingIcon = () => {
  return (
    <Tooltip title="All in Now Playing">
      <PlaylistAddCheckIcon />
    </Tooltip>
  );
};

export default AllPlaylistInPlayingIcon;
