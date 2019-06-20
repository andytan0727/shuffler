import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";

// Material Icons
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from "@material-ui/icons/Delete";

import {
  addListToPlay,
  removeVideo,
  removeVideoFromPlaying,
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
    removeVideo,
    addListToPlay,
    removeVideoFromPlaying,
  } = props;

  const handleAddVideosToPlaying = async () => {
    if (!checkedVideos.length) {
      await noVideoSelectedAlert();
      return;
    }

    addListToPlay({
      checked: true,
      persist: true,
    });

    notify("success", "Successfully added selected video(s) to playing 😎");
  };

  const handleRemoveVideo = async () => {
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
      removeVideo();
      await customSwal.fire("Deleted!", "Video(s) deleted 😎", "success");
    }
  };

  const handleRemoveVideoFromPlaying = async () => {
    if (!checkedVideos.length) {
      await noVideoSelectedAlert();
      return;
    }

    removeVideoFromPlaying();

    notify("success", "Successfully removed video(s) from playing 😎");
  };

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
  removeVideo: PropTypes.func.isRequired,
  addListToPlay: PropTypes.func.isRequired,
  removeVideoFromPlaying: PropTypes.func.isRequired,
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
    addListToPlay,
    removeVideo,
    removeVideoFromPlaying,
  }
)(VideosPanelBtnGroup);
