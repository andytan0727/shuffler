import React from "react";

import { IconButton, Tooltip } from "@material-ui/core";
import { Sync as SyncIcon } from "@material-ui/icons";

interface SyncPlaylistButtonProps {
  handleSyncPlaylist: () => void;
}

const SyncPlaylistButton: React.FunctionComponent<SyncPlaylistButtonProps> = (
  props: SyncPlaylistButtonProps
) => {
  const { handleSyncPlaylist } = props;

  return (
    <Tooltip title="Sync">
      <IconButton color="secondary" onClick={handleSyncPlaylist}>
        <SyncIcon />
      </IconButton>
    </Tooltip>
  );
};

export default SyncPlaylistButton;
