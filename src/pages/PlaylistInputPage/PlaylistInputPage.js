import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SwipeableViews from "react-swipeable-views";
import IconButton from "@material-ui/core/IconButton";
import HelpIcon from "@material-ui/icons/HelpOutline";
import Modal from "@material-ui/core/Modal";
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

const muiStyles = (theme) => ({
  paper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "80vh",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none",
    overflow: "auto",
  },
});

const PlaylistInputPage = (props) => {
  const { classes, loadedFromDB, shufflePlaylist } = props;
  const [swipeDivIdx, setSwipeDivIdx] = useState(Number(loadedFromDB));
  const [modalOpen, setModalOpen] = useState(false);
  const tabletBreakpoint = useMediaQuery("(min-width: 780px)");

  const handleSwipeDivIdxChange = (value) => {
    setSwipeDivIdx(value);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <React.Fragment>
      <div className={styles.playlistInPgDiv}>
        <div className={styles.inputDiv}>
          <SwipeableViews
            index={swipeDivIdx}
            onChangeIndex={handleSwipeDivIdxChange}
            slideClassName={styles.swipeableDiv}
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
        {/**  NOTE: done refactor */}
        {!tabletBreakpoint ? (
          <React.Fragment>
            <IconButton
              className={styles.helpButton}
              aria-label="help"
              onClick={handleModalOpen}
            >
              <HelpIcon />
            </IconButton>
            <Modal
              aria-labelledby="guide"
              aria-describedby="how to use guide for user"
              open={modalOpen}
              onClose={handleModalClose}
            >
              <div className={classes.paper}>
                <HelpGuide />
              </div>
            </Modal>
          </React.Fragment>
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
  shufflePlaylist: PropTypes.func,
};

const mapStateToProps = ({ ytplaylist: { loadedFromDB } }) => ({
  loadedFromDB,
});

const StyledPlaylistInputPage = withStyles(muiStyles)(PlaylistInputPage);

export default connect(
  mapStateToProps,
  {
    shufflePlaylist,
  }
)(StyledPlaylistInputPage);
