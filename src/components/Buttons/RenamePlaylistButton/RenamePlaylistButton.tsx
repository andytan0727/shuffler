import React from "react";

import { IconButton, Tooltip } from "@material-ui/core";
import { Edit as EditIcon } from "@material-ui/icons";

interface RenamePlaylistButtonProps {
  handleRename: () => void;
}

const RenamePlaylistButton: React.FunctionComponent<
  RenamePlaylistButtonProps
> = (props: RenamePlaylistButtonProps) => {
  const { handleRename } = props;

  return (
    <Tooltip title="Rename">
      <IconButton color="secondary" onClick={handleRename}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
};

export default RenamePlaylistButton;
