import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SwipeableViews from "react-swipeable-views";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import PlaylistInput from "../../components/InputComponents/PlaylistInput";
import SongListTabs from "../../components/TabsComponents/SongListTabs";
import SavedPlaylist from "../../components/ListComponents/SavedPlaylist";
import CombinedPlaylist from "../../components/ListComponents/CombinedPlaylist";

import { shufflePlaylist } from "../../store/ytplaylist/action";
import styles from "./styles.module.scss";

const muiStyles = () => ({});

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
          <div className={styles.songListTabsDiv}>
            <SongListTabs
              FirstTabComponent={SavedPlaylist}
              SecondTabComponent={CombinedPlaylist}
            />
          </div>
        </div>
        <div className={styles.guideDiv}>
          <h3>How To Use:</h3>
          <ul>
            <li>
              If you are new user, input YouTube playlist or video url as
              mentioned and press search. Shuffler will take care the rest for
              you.
            </li>
            <br />
            <li>
              After you pressed the search button, Shuffler will fetch and save
              the YouTube playlist/video from YouTube Data API v3 to your
              machine for future usage.
            </li>
            <br />
            <li>
              There is a two-tab panel shows up when fetching process is
              finished.
              <br />
              <br />
              <ul>
                <li>
                  <strong>Saved:</strong> Playlist(s) saved to your machine.
                </li>
                <li>
                  <strong>Playing: </strong> Currently playing playlist, a.k.a
                  the combined playlist from your saved playlist(s).
                </li>
              </ul>
            </li>
            <br />
            <li>
              You may play, shuffler or add more playlist or video as you wish
              before you proceed to play your Playing playlist. Enjoy.
            </li>
          </ul>
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
