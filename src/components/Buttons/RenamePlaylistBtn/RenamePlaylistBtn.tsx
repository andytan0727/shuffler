import React from "react";

import { IconButton, Tooltip } from "@material-ui/core";
import { Edit as EditIcon } from "@material-ui/icons";

interface RenamePlaylistBtnProps {
  handleRename: () => void;
}

const RenamePlaylistBtn: React.FC<RenamePlaylistBtnProps> = (
  props: RenamePlaylistBtnProps
) => {
  const { handleRename } = props;

  return (
    <Tooltip title="Rename">
      <IconButton color="secondary" onClick={handleRename}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
};

export default RenamePlaylistBtn;
