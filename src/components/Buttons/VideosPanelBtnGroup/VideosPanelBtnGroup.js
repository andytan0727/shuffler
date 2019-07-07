import React, { useCallback } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";

// Material Icons
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from "@material-ui/icons/Delete";

import {
  addVideosToListToPlayAction,
  deleteVideosAction,
  removeVideosFromListToPlayAction,
} from "../../../store/ytplaylist/action";
import { generateCustomSwal, notify } from "../../../utils/helper/notifyHelper";

import styles from "./styles.module.scss";

const noVideoSelectedAlert = async () => {
  const customSwal = await generateCustomSwal();
  await customSwal.fire({
    title: "No video is selected!💢",
    text: "Please select at least one video!",
    type: "warning",
  });
};

const VideosPanelBtnGroup = (props) => {
  const {
    preferDarkTheme,
    checkedVideos,
    addVideosToListToPlayAction,

    deleteVideosAction,
    removeVideosFromListToPlayAction,
  } = props;

  const handleAddVideosToPlaying = useCallback(async () => {
    if (!checkedVideos.length) {
      await noVideoSelectedAlert();
      return;
    }

    addVideosToListToPlayAction(checkedVideos);

    notify("success", "Successfully added selected video(s) to playing 😎");
  }, [addVideosToListToPlayAction, checkedVideos]);

  const handleRemoveVideo = useCallback(async () => {
    const customSwal = await generateCustomSwal();

    if (!checkedVideos.length) {
      await noVideoSelectedAlert();
      return;
    }

    const result = await customSwal.fire({
      title: "Remove video(s)",
      text: "Are you sure?🤔",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it please!🔥",
      cancelButtonText: "No!!!😱",
    });

    if (result.value) {
      deleteVideosAction(checkedVideos);
      await customSwal.fire("Deleted!", "Video(s) deleted 😎", "success");
    }
  }, [checkedVideos, deleteVideosAction]);

  const handleRemoveVideoFromPlaying = useCallback(async () => {
    if (!checkedVideos.length) {
      await noVideoSelectedAlert();
      return;
    }

    removeVideosFromListToPlayAction(checkedVideos);
  }, [checkedVideos, removeVideosFromListToPlayAction]);

  return (
    <div
      className={classNames({
        [styles.btnGroupLight]: !preferDarkTheme,
        [styles.btnGroupDark]: preferDarkTheme,
      })}
    >
      <button
        onClick={handleAddVideosToPlaying}
        data-tooltip={"Add to playing list"}
      >
        <AddIcon />
      </button>
      <button
        onClick={handleRemoveVideoFromPlaying}
        data-tooltip={"Remove from playing"}
      >
        <RemoveIcon />
      </button>
      <button onClick={handleRemoveVideo} data-tooltip={"Delete video"}>
        <DeleteIcon />
      </button>
    </div>
  );
};

VideosPanelBtnGroup.propTypes = {
  preferDarkTheme: PropTypes.bool.isRequired,
  checkedVideos: PropTypes.array.isRequired,
  addVideosToListToPlayAction: PropTypes.func.isRequired,
  deleteVideosAction: PropTypes.func.isRequired,
  removeVideosFromListToPlayAction: PropTypes.func.isRequired,
};

const mapStatesToProps = ({
  userPreferences: { preferDarkTheme },
  ytplaylist: { checkedVideos },
}) => ({
  preferDarkTheme,
  checkedVideos,
});

export default connect(
  mapStatesToProps,
  {
    addVideosToListToPlayAction,
    deleteVideosAction,
    removeVideosFromListToPlayAction,
  }
)(VideosPanelBtnGroup);
