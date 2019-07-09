import React from "react";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import { addVideosToListToPlayAction } from "../../../../store/ytplaylist/action";

const AddVideoToPlayingBtn = (props) => {
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

AddVideoToPlayingBtn.propTypes = {
  addVideosToListToPlayAction: PropTypes.func.isRequired,
};

export default AddVideoToPlayingBtn;
