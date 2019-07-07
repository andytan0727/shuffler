import React, { useCallback } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

// Material Icons
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import ClearIcon from "@material-ui/icons/Clear";

import {
  clearListToPlayAction,
  shuffleListToPlayAction,
} from "../../../store/ytplaylist/action";
import { generateCustomSwal, notify } from "../../../utils/helper/notifyHelper";

import styles from "./styles.module.scss";

const PlayingPanelBtnGroup = (props) => {
  const {
    preferDarkTheme,
    listToPlay,
    history,
    clearListToPlayAction,
    shuffleListToPlayAction,
  } = props;

  const handleRedirectToPlayer = useCallback(() => {
    if (!listToPlay.length) {
      notify(
        "warning",
        "💢 Please don't proceed to player with no playing list!"
      );
      return;
    }

    history.push("/player/ytplayer");
  }, [history, listToPlay.length]);

  const handleClearListToPlay = useCallback(async () => {
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
      clearListToPlayAction();
      notify("success", "Successfully cleared playing playlist! 😎");
    }
  }, [clearListToPlayAction]);

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
      <button
        onClick={shuffleListToPlayAction}
        data-tooltip="Shuffle playing list"
      >
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
  clearListToPlayAction: PropTypes.func.isRequired,
  shuffleListToPlayAction: PropTypes.func.isRequired,
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
    clearListToPlayAction,
    shuffleListToPlayAction,
  }
)(withRouter(PlayingPanelBtnGroup));
