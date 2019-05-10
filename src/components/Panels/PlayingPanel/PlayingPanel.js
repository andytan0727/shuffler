import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import CombinedPlaylist from "../../Lists/CombinedPlaylist";

import PlayingPanelBtnGroup from "../../Buttons/PlayingPanelBtnGroup";

import styles from "./styles.module.scss";

const PlayingPanel = (props) => {
  const { listToPlay } = props;

  return (
    <div className={styles.playingPanelDiv}>
      <h2
        className={styles.playingPanelTitle}
        data-totalsong={listToPlay.length}
      >
        Playing
      </h2>
      <CombinedPlaylist />
      <PlayingPanelBtnGroup />
    </div>
  );
};

PlayingPanel.propTypes = {
  listToPlay: PropTypes.array.isRequired,
};

const mapStatesToProps = ({ ytplaylist: { listToPlay } }) => ({
  listToPlay,
});

export default connect(
  mapStatesToProps,
  {}
)(withRouter(PlayingPanel));
