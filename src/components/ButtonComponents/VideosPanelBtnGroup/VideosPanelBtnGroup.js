import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import CreateIcon from "@material-ui/icons/Create";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from "@material-ui/icons/Delete";

import {
  addListToPlay,
  removeVideo,
  renameVideo,
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
    renameVideo,
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

  const handleRenameVideo = async () => {
    const customSwal = await generateCustomSwal();

    if (!checkedVideos.length) {
      await noVideoSelectedAlert();
      return;
    }

    if (checkedVideos.length > 1) {
      await customSwal.fire({
        title: "You can only rename one video at once",
        text: "Please select only one video!",
        type: "warning",
      });
      return;
    }

    const { value: newName } = await customSwal.fire({
      title: "Rename Video",
      input: "text",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      inputValidator: (newName) => {
        if (!newName) {
          return "Please enter something 💢";
        }
      },
    });

    if (newName) {
      renameVideo(newName);
      customSwal.fire({
        title: "All done!",
        html: `Your selected video has been renamed to <strong>${newName}</strong>`,
        confirmButtonText: "Yeah 😎",
      });
    }
  };

  return (
    <div
      className={classNames({
        [styles.btnGroupLight]: !preferDarkTheme,
        [styles.btnGroupDark]: preferDarkTheme,
      })}
    >
      <button onClick={handleRenameVideo} data-tooltip={"Rename video"}>
        <CreateIcon />
      </button>
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
  renameVideo: PropTypes.func.isRequired,
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
    renameVideo,
    removeVideoFromPlaying,
  }
)(VideosPanelBtnGroup);
