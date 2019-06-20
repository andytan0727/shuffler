import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

// Material Icons
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import ClearIcon from "@material-ui/icons/Clear";

import {
  clearListToPlay,
  shufflePlaylist,
} from "../../../store/ytplaylist/action";
import { generateCustomSwal, notify } from "../../../utils/helper/notifyHelper";

import styles from "./styles.module.scss";

const PlayingPanelBtnGroup = (props) => {
  const {
    preferDarkTheme,
    listToPlay,
    history,
    clearListToPlay,
    shufflePlaylist,
  } = props;

  const handleRedirectToPlayer = () => {
    if (!listToPlay.length) {
      notify(
        "warning",
        "💢 Please don't proceed to player with no playing list!"
      );
      return;
    }

    history.push("/player/ytplayer");
  };

  const handleClearListToPlay = async () => {
    const customSwal = await generateCustomSwal();

    const result = await customSwal.fire({
      title: "Clear playing list",
      text: "Are you sure?🤔",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear it please!🔥",
      cancelButtonText: "No!!!😱",
    });

    if (result.value) {
      clearListToPlay();
      notify("success", "Successfully cleared playing playlist! 😎");
    }
  };

  return (
    <div
      className={classNames({
        [styles.playingPanelBtnGroupLight]: !preferDarkTheme,
        [styles.playingPanelBtnGroupDark]: preferDarkTheme,
      })}
    >
      <button onClick={handleRedirectToPlayer} data-tooltip="Play">
        <PlayArrowIcon />
      </button>
      <button onClick={shufflePlaylist} data-tooltip="Shuffle playing list">
        <ShuffleIcon />
      </button>
      <button onClick={handleClearListToPlay} data-tooltip="Clear playing list">
        <ClearIcon />
      </button>
    </div>
  );
};

PlayingPanelBtnGroup.propTypes = {
  preferDarkTheme: PropTypes.bool.isRequired,
  listToPlay: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  clearListToPlay: PropTypes.func.isRequired,
  shufflePlaylist: PropTypes.func.isRequired,
};

const mapStatesToProps = ({
  userPreferences: { preferDarkTheme },
  ytplaylist: { listToPlay },
}) => ({
  preferDarkTheme,
  listToPlay,
});

export default connect(
  mapStatesToProps,
  {
    clearListToPlay,
    shufflePlaylist,
  }
)(withRouter(PlayingPanelBtnGroup));
