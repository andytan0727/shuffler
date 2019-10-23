import React from "react";

import IconButton from "@material-ui/core/IconButton";
import { Delete as DeleteIcon } from "@material-ui/icons";

interface DeleteItemBtnProps {
  handleOnClick: (e: OnClickEvent) => void;
}

const DeleteItemBtn = (props: DeleteItemBtnProps) => {
  const { handleOnClick } = props;

  return (
    <IconButton edge="end" aria-label="delete-video" onClick={handleOnClick}>
      <DeleteIcon />
    </IconButton>
  );
};

export default DeleteItemBtn;
