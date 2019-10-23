import React from "react";

import { IconButton, Tooltip } from "@material-ui/core";
import { Sync as SyncIcon } from "@material-ui/icons";

interface SyncPlaylistBtnProps {
  handleSyncPlaylist: () => void;
}

const SyncPlaylistBtn: React.FunctionComponent<SyncPlaylistBtnProps> = (
  props: SyncPlaylistBtnProps
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

export default SyncPlaylistBtn;
