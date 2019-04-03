import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import { notify } from "../../utils/helper/notifyHelper";

import styles from "./styles.module.scss";

const CtrlBtnGroup = ({
  shufflePlaylist,
  handleSwipeDivIdxChange,
  listToPlay,
  history,
}) => {
  const handleRedirectToPlayer = () => {
    if (!listToPlay.length) {
      notify(
        "warning",
        "💢 Please don't proceed to player with no playing list!"
      );
      return;
    }

    history.push("/player");
  };

  return (
    <div className={styles.ctrlButtonsDiv}>
      <Tooltip title="play">
        <Fab
          size="medium"
          color="primary"
          onClick={handleRedirectToPlayer}
          aria-label="play"
        >
          <PlayArrowIcon />
        </Fab>
      </Tooltip>

      <Tooltip title="shuffle">
        <Fab
          size="medium"
          color="primary"
          aria-label="shuffle"
          onClick={shufflePlaylist}
        >
          <ShuffleIcon />
        </Fab>
      </Tooltip>

      <Tooltip title="add more">
        <Fab
          size="medium"
          color="secondary"
          onClick={handleSwipeDivIdxChange.bind(this, 0)}
          aria-label="add-more"
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </div>
  );
};

CtrlBtnGroup.propTypes = {
  handleSwipeDivIdxChange: PropTypes.func.isRequired,
  shufflePlaylist: PropTypes.func,
  listToPlay: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(CtrlBtnGroup);
