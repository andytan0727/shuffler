import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SwipeableViews from "react-swipeable-views";
import IconButton from "@material-ui/core/IconButton";
import HelpIcon from "@material-ui/icons/HelpOutline";
import { withStyles } from "@material-ui/core/styles";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import PlaylistInput from "../../components/InputComponents/PlaylistInput";
import SongListTabs from "../../components/TabsComponents/SongListTabs";
import SavedPlaylist from "../../components/ListComponents/SavedPlaylist";
import CombinedPlaylist from "../../components/ListComponents/CombinedPlaylist";
import CtrlBtnGroup from "./CtrlBtnGroup";
import HelpGuide from "./HelpGuide";

import { shufflePlaylist } from "../../store/ytplaylist/action";
import styles from "./styles.module.scss";

const muiStyles = () => ({});

const PlaylistInputPage = props => {
  const { classes, loadedFromDB, shufflePlaylist } = props;
  const [swipeDivIdx, setSwipeDivIdx] = useState(Number(loadedFromDB));
  const matchesTablet = useMediaQuery("(max-width: 780px)");

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
            <CtrlBtnGroup
              handleSwipeDivIdxChange={handleSwipeDivIdxChange}
              shufflePlaylist={shufflePlaylist}
            />
          </SwipeableViews>
          <div className={styles.songListTabsDiv}>
            <SongListTabs
              FirstTabComponent={SavedPlaylist}
              SecondTabComponent={CombinedPlaylist}
            />
          </div>
        </div>
        {matchesTablet ? (
          <IconButton className={styles.helpButton} aria-label="help">
            <HelpIcon />
          </IconButton>
        ) : (
          <HelpGuide />
        )}
      </div>
    </React.Fragment>
  );
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
