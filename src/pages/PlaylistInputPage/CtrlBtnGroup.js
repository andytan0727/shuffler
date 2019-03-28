import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import styles from "./styles.module.scss";

const CtrlBtnGroup = ({ shufflePlaylist, handleSwipeDivIdxChange }) => (
  <div className={styles.ctrlButtonsDiv}>
    <Fab
      variant="extended"
      size="medium"
      color="secondary"
      component={Link}
      to={"/player"}
      aria-label="play"
    >
      Play
    </Fab>
    <Fab
      variant="extended"
      size="medium"
      color="secondary"
      aria-label="shuffle"
      onClick={shufflePlaylist}
    >
      Shuffle
    </Fab>

    <Fab
      size="small"
      onClick={handleSwipeDivIdxChange.bind(this, 0)}
      aria-label="add-more"
    >
      <AddIcon />
    </Fab>
  </div>
);

CtrlBtnGroup.propTypes = {
  handleSwipeDivIdxChange: PropTypes.func.isRequired,
  shufflePlaylist: PropTypes.func
};

export default CtrlBtnGroup;
