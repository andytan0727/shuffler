import React from "react";
import { addVideosToListToPlayAction } from "store/ytplaylist/action";

import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

interface AddVideoToPlayingBtnConnectedDispatch {
  addVideosToListToPlayAction: typeof addVideosToListToPlayAction;
}

type AddVideoToPlayingBtnProps = AddVideoToPlayingBtnConnectedDispatch;

const AddVideoToPlayingBtn = () => {
  const handleAddVideoToPlaying = () => {};

  return (
    <div>
      <IconButton
        onClick={handleAddVideoToPlaying}
        data-tooltip={"Add to playing list"}
      >
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default AddVideoToPlayingBtn;
