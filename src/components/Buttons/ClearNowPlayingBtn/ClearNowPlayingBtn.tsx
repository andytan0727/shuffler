import React from "react";

import { IconButton, Tooltip } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";

interface ClearNowPlayingBtnProps {
  handleClearNowPlaying: (e: OnClickEvent) => void;
}

const ClearNowPlayingBtn = (props: ClearNowPlayingBtnProps) => {
  const { handleClearNowPlaying } = props;

  return (
    <Tooltip title="Clear">
      <IconButton onClick={handleClearNowPlaying} color="secondary">
        <CloseIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ClearNowPlayingBtn;
