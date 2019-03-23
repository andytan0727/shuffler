import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SwipeableViews from "react-swipeable-views";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import PlaylistAppBar from "../../components/BarComponents/PlaylistAppBar";
import PlaylistInput from "../../components/InputComponents/PlaylistInput";
import SongList from "../../components/ListComponents/SongList";

import { shufflePlaylist } from "../../store/ytplaylist/action";
import styles from "./styles.module.scss";

const muiStyles = theme => ({
  divider: {
    width: "100%",
    marginLeft: 0,
    marginRight: 0
  }
});

const CtrlBtnGroup = connect(
  null,
  {
    shufflePlaylist
  }
)(({ shufflePlaylist, handleSwipeDivIdxChange }) => (
  <React.Fragment>
    <Fab variant="extended" size="medium" color="secondary" aria-label="play">
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
      variant="extended"
      // color="secondary"
      size="medium"
      onClick={handleSwipeDivIdxChange.bind(this, 0)}
      aria-label="add-more"
    >
      <AddIcon />
      Add more
    </Fab>
  </React.Fragment>
));

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
          <SongList />
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
