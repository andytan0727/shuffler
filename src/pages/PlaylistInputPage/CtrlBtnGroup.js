import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import ShuffleIcon from "@material-ui/icons/Shuffle";

import styles from "./styles.module.scss";

const CtrlBtnGroup = ({ shufflePlaylist, handleSwipeDivIdxChange }) => (
  <div className={styles.ctrlButtonsDiv}>
    <Tooltip title="play">
      <Fab
        size="medium"
        color="primary"
        component={Link}
        to={"/player"}
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

CtrlBtnGroup.propTypes = {
  handleSwipeDivIdxChange: PropTypes.func.isRequired,
  shufflePlaylist: PropTypes.func
};

export default CtrlBtnGroup;
