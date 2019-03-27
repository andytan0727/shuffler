import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SwipeableViews from "react-swipeable-views";
import { Link } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import PlaylistInput from "../../components/InputComponents/PlaylistInput";
import SongListTabs from "../../components/TabsComponents/SongListTabs";
import SavedPlaylist from "../../components/ListComponents/SavedPlaylist";
import CombinedPlaylist from "../../components/ListComponents/CombinedPlaylist";

import { shufflePlaylist } from "../../store/ytplaylist/action";
import styles from "./styles.module.scss";

const muiStyles = () => ({
  divider: {
    width: "100%",
    marginLeft: 0,
    marginRight: 0
  }
});

const CtrlBtnGroup = ({ shufflePlaylist, handleSwipeDivIdxChange }) => (
  <React.Fragment>
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
);

const PlaylistInputPage = props => {
  const { classes, loadedFromDB, shufflePlaylist } = props;
  const [swipeDivIdx, setSwipeDivIdx] = useState(Number(loadedFromDB));

  const handleSwipeDivIdxChange = value => {
    setSwipeDivIdx(value);
  };

  return (
    <React.Fragment>
      <div className={styles.playlistInPgDiv}>
        <div className={styles.inputDiv}>
          <SwipeableViews
            index={swipeDivIdx}
            onChangeIndex={handleSwipeDivIdxChange}
            className={styles.swipeableDiv}
          >
            <PlaylistInput handleSwipeDivIdxChange={handleSwipeDivIdxChange} />
            <div className={styles.ctrlButtonsDiv}>
              <CtrlBtnGroup
                handleSwipeDivIdxChange={handleSwipeDivIdxChange}
                shufflePlaylist={shufflePlaylist}
              />
            </div>
          </SwipeableViews>
          <Divider variant="middle" className={classes.divider} />
          <div className={styles.songListTabsDiv}>
            <SongListTabs
              FirstTabComponent={SavedPlaylist}
              SecondTabComponent={CombinedPlaylist}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

CtrlBtnGroup.propTypes = {
  handleSwipeDivIdxChange: PropTypes.func.isRequired,
  shufflePlaylist: PropTypes.func
};

PlaylistInputPage.propTypes = {
  classes: PropTypes.object.isRequired,
  loadedFromDB: PropTypes.bool.isRequired,
  shufflePlaylist: PropTypes.func
};

const mapStateToProps = ({ ytplaylist: { loadedFromDB } }) => ({
  loadedFromDB
});

const StyledPlaylistInputPage = withStyles(muiStyles)(PlaylistInputPage);

export default connect(
  mapStateToProps,
  {
    shufflePlaylist
  }
)(StyledPlaylistInputPage);
