import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import { Delete as DeleteIcon } from "@material-ui/icons";

import { deleteVideo } from "../../../../store/ytplaylist/action";

const DeleteVideoButton = ({ itemId, deleteVideo }) => {
  return (
    <IconButton
      edge="end"
      aria-label="delete-video"
      onClick={useCallback(() => deleteVideo(itemId), [itemId])}
    >
      <DeleteIcon />
    </IconButton>
  );
};

DeleteVideoButton.propTypes = {
  itemId: PropTypes.string.isRequired,
  deleteVideo: PropTypes.func.isRequired,
};

export default connect(
  null,
  {
    deleteVideo,
  }
)(DeleteVideoButton);
