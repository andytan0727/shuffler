import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";

// Material Icons
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
    preferDarkTheme,
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
    });

    notify("success", "Successfully added selected playlist(s) to playing 😎");
  };

  const handleRemovePlaylistFromPlaying = async () => {
    if (!checkedPlaylists.length) {
      await noPlaylistSelectedAlert();
      return;
    }

    removePlaylistFromPlaying();
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
      notify("success", "Successfully deleted playlist(s) 😎");
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
    <div
      className={classNames({
        [styles.btnGroupDark]: preferDarkTheme,
        [styles.btnGroupLight]: !preferDarkTheme,
      })}
    >
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
  preferDarkTheme: PropTypes.bool.isRequired,
  checkedPlaylists: PropTypes.array.isRequired,
  addListToPlay: PropTypes.func.isRequired,
  removePlaylist: PropTypes.func.isRequired,
  removePlaylistFromPlaying: PropTypes.func.isRequired,
  setViewPlaylist: PropTypes.func.isRequired,
};

const mapStatesToProps = ({
  userPreferences: { preferDarkTheme },
  ytplaylist: { checkedPlaylists },
}) => ({
  preferDarkTheme,
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
