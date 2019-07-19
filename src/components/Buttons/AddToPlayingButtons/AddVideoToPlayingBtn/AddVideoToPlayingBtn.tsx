import React from "react";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import { addVideosToListToPlayAction } from "store/ytplaylist/action";

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
