import React from "react";

import { IconButton, Tooltip } from "@material-ui/core";
import {
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Shuffle as ShuffleIcon,
} from "@material-ui/icons";

interface ManagementPanelCtrlBtnGroupProps {
  handlePlay: (e: OnClickEvent) => void;
  handleShuffle: (e: OnClickEvent) => void;
  handleDelete: (e: OnClickEvent) => void;
}

const ManagementPanelCtrlBtnGroup = (
  props: ManagementPanelCtrlBtnGroupProps
) => {
  const { handlePlay, handleShuffle, handleDelete } = props;

  return (
    <div>
      <Tooltip title="Play">
        <IconButton color="secondary" onClick={handlePlay}>
          <PlayArrowIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Shuffle">
        <IconButton color="secondary" onClick={handleShuffle}>
          <ShuffleIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Selected">
        <IconButton color="secondary" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ManagementPanelCtrlBtnGroup;
