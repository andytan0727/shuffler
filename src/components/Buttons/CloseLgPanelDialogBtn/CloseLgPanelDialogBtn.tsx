import React from "react";

import { IconButton } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";

interface CloseLgPanelDialogBtnProps {
  handleCloseDialog: () => void;
}

const CloseLgPanelDialogBtn: React.FunctionComponent<
  CloseLgPanelDialogBtnProps
> = (props: CloseLgPanelDialogBtnProps) => {
  const { handleCloseDialog } = props;

  return (
    <IconButton
      edge="start"
      color="inherit"
      onClick={handleCloseDialog}
      aria-label="close dialog"
    >
      <CloseIcon />
    </IconButton>
  );
};

export default CloseLgPanelDialogBtn;
