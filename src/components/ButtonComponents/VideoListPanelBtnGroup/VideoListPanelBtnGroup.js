import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from "@material-ui/icons/Delete";
import ViewListIcon from "@material-ui/icons/ViewList";

import {
  addListToPlay,
  removePlaylist,
  removePlaylistFromPlaying,
} from "../../../store/ytplaylist/action";
import { generateCustomSwal, notify } from "../../../utils/helper/notifyHelper";

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
    removePlaylistFromPlaying,
    setViewPlaylist,
  } = props;

  const handleAddPlaylistToPlaying = async () => {
    if (!checkedPlaylists.length) {
      await noPlaylistSelectedAlert();
      return;
    }

    addListToPlay({
      checked: true,
      persist: true,
    });

    notify("success", "Successfully added selected playlist(s) to playing 😎");
  };

  const handleRemovePlaylistFromPlaying = async () => {
    if (!checkedPlaylists.length) {
      await noPlaylistSelectedAlert();
      return;
    }

    removePlaylistFromPlaying();

    notify("success", "Successfully removed playlist(s) from playing 😎");
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
      <button
        onClick={handleAddPlaylistToPlaying}
        data-tooltip={"Add to playing"}
      >
        <AddIcon />
      </button>
      <button
        onClick={handleRemovePlaylistFromPlaying}
        data-tooltip={"Remove from playing"}
      >
        <RemoveIcon />
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
  removePlaylistFromPlaying: PropTypes.func.isRequired,
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
    removePlaylistFromPlaying,
  }
)(VideoListPanelBtnGroup);
