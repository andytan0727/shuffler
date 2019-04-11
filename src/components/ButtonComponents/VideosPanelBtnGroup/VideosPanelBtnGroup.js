import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CreateIcon from "@material-ui/icons/Create";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

import {
  addListToPlay,
  removeVideo,
  renameVideo,
} from "../../../store/ytplaylist/action";
import { generateCustomSwal } from "../../../utils/helper/notifyHelper";

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
  const { checkedVideos, removeVideo, addListToPlay, renameVideo } = props;

  const handleAddVideosToPlaying = async () => {
    const customSwal = await generateCustomSwal();

    if (!checkedVideos.length) {
      await noVideoSelectedAlert();
      return;
    }

    addListToPlay({
      checked: true,
      persist: true,
    });

    await customSwal.fire(
      "Added.",
      "Selected video is added to playing list 😎",
      "success"
    );
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
    <div className={styles.btnGroup}>
      <button onClick={handleRenameVideo} data-tooltip={"Rename video"}>
        <CreateIcon />
      </button>
      <button
        onClick={handleAddVideosToPlaying}
        data-tooltip={"Add to playing list"}
      >
        <AddIcon />
      </button>
      <button onClick={handleRemoveVideo} data-tooltip={"Delete video"}>
        <DeleteIcon />
      </button>
    </div>
  );
};

VideosPanelBtnGroup.propTypes = {
  checkedVideos: PropTypes.array.isRequired,
  renameVideo: PropTypes.func.isRequired,
  removeVideo: PropTypes.func.isRequired,
  addListToPlay: PropTypes.func.isRequired,
};

const mapStatesToProps = ({ ytplaylist: { checkedVideos } }) => ({
  checkedVideos,
});

export default connect(
  mapStatesToProps,
  {
    addListToPlay,
    removeVideo,
    renameVideo,
  }
)(VideosPanelBtnGroup);
