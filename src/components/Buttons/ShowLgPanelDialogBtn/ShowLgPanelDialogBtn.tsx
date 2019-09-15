import React from "react";

import { IconButton, Tooltip } from "@material-ui/core";
import { ViewList as ViewListIcon } from "@material-ui/icons";

interface ShowLgPanelDialogBtnProps {
  handleOpenDialog: () => void;
}

const ShowLgPanelDialogBtn: React.FunctionComponent<
  ShowLgPanelDialogBtnProps
> = (props: ShowLgPanelDialogBtnProps) => {
  const { handleOpenDialog } = props;

  return (
    <Tooltip title="Manage playlists">
      <IconButton color="secondary" onClick={handleOpenDialog}>
        <ViewListIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ShowLgPanelDialogBtn;
