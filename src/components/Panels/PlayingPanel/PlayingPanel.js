import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import ClearIcon from "@material-ui/icons/Clear";
import CombinedPlaylist from "../../ListComponents/CombinedPlaylist";
import {
  clearListToPlay,
  shufflePlaylist,
} from "../../../store/ytplaylist/action";

import { generateCustomSwal, notify } from "../../../utils/helper/notifyHelper";

import styles from "./styles.module.scss";

const PlayingPanel = (props) => {
  const { listToPlay, history, clearListToPlay, shufflePlaylist } = props;

  const handleRedirectToPlayer = () => {
    if (!listToPlay.length) {
      notify(
        "warning",
        "💢 Please don't proceed to player with no playing list!"
      );
      return;
    }

    history.push("/player/miniplayer");
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
      await customSwal.fire(
        "Cleared!",
        "Playing list has been cleared 😎",
        "success"
      );
    }
  };

  return (
    <div className={styles.playingPanelDiv}>
      <h2
        className={styles.playingPanelTitle}
        data-totalsong={listToPlay.length}
      >
        Playing
      </h2>
      <CombinedPlaylist />
      <div className={styles.playingPanelBtnGroup}>
        <button onClick={handleRedirectToPlayer} data-tooltip="Play">
          <PlayArrowIcon />
        </button>
        <button
          className={styles.shuffleBtn}
          onClick={shufflePlaylist}
          data-tooltip="Shuffle playing list"
        >
          <ShuffleIcon />
        </button>
        <button
          className={styles.clearPlayingBtn}
          onClick={handleClearListToPlay}
          data-tooltip="Clear playing list"
        >
          <ClearIcon />
        </button>
      </div>
    </div>
  );
};

PlayingPanel.propTypes = {
  listToPlay: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  clearListToPlay: PropTypes.func.isRequired,
  shufflePlaylist: PropTypes.func.isRequired,
};

const mapStatesToProps = ({ ytplaylist: { listToPlay } }) => ({
  listToPlay,
});

export default connect(
  mapStatesToProps,
  {
    clearListToPlay,
    shufflePlaylist,
  }
)(withRouter(PlayingPanel));
