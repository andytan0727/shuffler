import React, { useState } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import PlaylistAppBar from "../../BarComponents/PlaylistAppBar";
import TopBar from "../../BarComponents/TopBar";
import PlaylistInput from "../../InputComponents/PlaylistInput";
import SongChips from "../../Chips/SongChips";

import styles from "./styles.module.scss";

const muiStyles = theme => ({
  divider: {
    width: "100%",
    marginLeft: 0,
    marginRight: 0
  }
});

const CtrlBtnGroup = ({ handleSwipeDivIdxChange }) => (
  <React.Fragment>
    {/* <Button variant="contained" color="secondary" aria-label="play">
      Play
    </Button> */}
    {/* <Button variant="contained" color="secondary" aria-label="shuffle">
      Shuffle
    </Button> */}
    <Fab variant="extended" color="secondary" aria-label="play">
      Play
    </Fab>
    <Fab variant="extended" color="secondary" aria-label="shuffle">
      Shuffle
    </Fab>

    <Fab
      variant="extended"
      // color="secondary"
      size="small"
      onClick={handleSwipeDivIdxChange.bind(this, 0)}
      aria-label="add-more"
    >
      <AddIcon />
      Add more
    </Fab>
  </React.Fragment>
);

const PlaylistInputPage = props => {
  const { classes } = props;
  const [swipeDivIdx, setSwipeDivIdx] = useState(0);

  const handleSwipeDivIdxChange = value => {
    setSwipeDivIdx(value);
  };

  return (
    <React.Fragment>
      <PlaylistAppBar />
      {/* <TopBar /> */}
      <div className={styles.playlistInPgDiv}>
        <div className={styles.inputDiv}>
          <SwipeableViews
            index={swipeDivIdx}
            onChangeIndex={handleSwipeDivIdxChange}
            className={styles.swipeableDiv}
          >
            <PlaylistInput handleSwipeDivIdxChange={handleSwipeDivIdxChange} />
            <div className={styles.ctrlButtonsDiv}>
              <CtrlBtnGroup handleSwipeDivIdxChange={handleSwipeDivIdxChange} />
            </div>
          </SwipeableViews>
          <Divider variant="middle" className={classes.divider} />
          <SongChips />
        </div>
      </div>
    </React.Fragment>
  );
};

CtrlBtnGroup.propTypes = {
  handleSwipeDivIdxChange: PropTypes.func.isRequired
};

PlaylistInputPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(muiStyles)(PlaylistInputPage);
