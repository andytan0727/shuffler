import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CreateIcon from "@material-ui/icons/Create";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import ViewListIcon from "@material-ui/icons/ViewList";

import {
  addListToPlay,
  removePlaylist,
  renamePlaylist,
} from "../../../store/ytplaylist/action";
import { generateCustomSwal } from "../../../utils/helper/notifyHelper";

import styles from "./styles.module.scss";

const noPlaylistSelectedAlert = async () => {
  const customSwal = await generateCustomSwal();
  await customSwal.fire({
    title: "No playlist is selected!💢",
    text: "Please select at least one playlist!",
    type: "warning",
  });
};

const VideoListPanelBtnGroup = (props) => {
  const {
    checkedPlaylists,
    addListToPlay,
    removePlaylist,
    renamePlaylist,
    setViewPlaylist,
  } = props;

  const handleAddPlaylistToPlaying = async () => {
    const customSwal = await generateCustomSwal();

    if (!checkedPlaylists.length) {
      await noPlaylistSelectedAlert();
      return;
    }

    addListToPlay({
      checked: true,
      persist: true,
    });

    await customSwal.fire(
      "Added.",
      "Selected playlist is added to playing list 😎",
      "success"
    );
  };

  const handleRemovePlaylist = async () => {
    const customSwal = await generateCustomSwal();

    if (!checkedPlaylists.length) {
      await noPlaylistSelectedAlert();
      return;
    }

    const result = await customSwal.fire({
      title: "Remove playlist",
      text: "Are you sure?🤔",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it please!🔥",
      cancelButtonText: "No!!!😱",
    });

    if (result.value) {
      removePlaylist();
      await customSwal.fire(
        "Deleted!",
        "Playlist has been deleted 😎",
        "success"
      );
    }
  };

  const handleRenamePlaylist = async () => {
    const customSwal = await generateCustomSwal();

    if (!checkedPlaylists.length) {
      await noPlaylistSelectedAlert();
      return;
    }

    if (checkedPlaylists.length > 1) {
      await customSwal.fire({
        title: "You can only rename one playlist at once",
        text: "Please select only one playlist!",
        type: "warning",
      });
      return;
    }

    const { value: newName } = await customSwal.fire({
      title: "Rename Playlist",
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
      renamePlaylist(newName);
      customSwal.fire({
        title: "All done!",
        html: `Your selected playlist has been renamed to <strong>${newName}</strong>`,
        confirmButtonText: "Yeah 😎",
      });
    }
  };

  const handleViewPlaylist = async () => {
    const customSwal = await generateCustomSwal();

    if (!checkedPlaylists.length) {
      await noPlaylistSelectedAlert();
      return;
    }

    if (checkedPlaylists.length > 1) {
      await customSwal.fire({
        title: "You can only view one playlist at once",
        text: "Please select only one playlist!",
        type: "warning",
      });
      return;
    }

    setViewPlaylist(true);
  };

  return (
    <div className={styles.btnGroup}>
      <button onClick={handleRenamePlaylist} data-tooltip={"Rename playlist"}>
        <CreateIcon />
      </button>
      <button
        onClick={handleAddPlaylistToPlaying}
        data-tooltip={"Add to playing list"}
      >
        <AddIcon />
      </button>
      <button onClick={handleRemovePlaylist} data-tooltip={"Remove playlist"}>
        <DeleteIcon />
      </button>
      <button onClick={handleViewPlaylist} data-tooltip={"View playlist"}>
        <ViewListIcon />
      </button>
    </div>
  );
};

VideoListPanelBtnGroup.propTypes = {
  checkedPlaylists: PropTypes.array.isRequired,
  addListToPlay: PropTypes.func.isRequired,
  removePlaylist: PropTypes.func.isRequired,
  renamePlaylist: PropTypes.func.isRequired,
  setViewPlaylist: PropTypes.func.isRequired,
};

const mapStatesToProps = ({ ytplaylist: { checkedPlaylists } }) => ({
  checkedPlaylists,
});

export default connect(
  mapStatesToProps,
  {
    addListToPlay,
    removePlaylist,
    renamePlaylist,
  }
)(VideoListPanelBtnGroup);
