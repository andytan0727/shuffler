import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import { Delete as DeleteIcon } from "@material-ui/icons";

import { deleteVideosAction } from "../../../../store/ytplaylist/action";

const DeleteVideoButton = ({ itemId, deleteVideosAction }) => {
  return (
    <IconButton
      edge="end"
      aria-label="delete-video"
      onClick={useCallback(() => deleteVideosAction([itemId]), [
        deleteVideosAction,
        itemId,
      ])}
    >
      <DeleteIcon />
    </IconButton>
  );
};

DeleteVideoButton.propTypes = {
  itemId: PropTypes.string.isRequired,
  deleteVideosAction: PropTypes.func.isRequired,
};

export default connect(
  null,
  {
    deleteVideosAction,
  }
)(DeleteVideoButton);
