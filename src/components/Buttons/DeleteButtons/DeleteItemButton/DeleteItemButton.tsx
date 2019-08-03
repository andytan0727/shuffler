import React from "react";

import IconButton from "@material-ui/core/IconButton";
import { Delete as DeleteIcon } from "@material-ui/icons";

interface DeleteItemButtonProps {
  handleOnClick: (e: OnClickEvent) => void;
}

const DeleteItemButton = (props: DeleteItemButtonProps) => {
  const { handleOnClick } = props;

  return (
    <IconButton edge="end" aria-label="delete-video" onClick={handleOnClick}>
      <DeleteIcon />
    </IconButton>
  );
};

export default DeleteItemButton;
