import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TopBar from "../../components/BarComponents/TopBar";
import VideoPlayer from "../../components/VideoPlayer";

import styles from "./styles.module.scss";

const YTPlayerPage = props => {
  const {
    ytplayer: { curSongIdx },
    ytplaylist: { listToPlay }
  } = props;

  return (
    <React.Fragment>
      <TopBar />
      <div className={styles.ytPlayerDiv}>
        <h3>
          {listToPlay.length !== 0
            ? listToPlay[curSongIdx].snippet.title
            : "No Video Selected"}
        </h3>
        <VideoPlayer />
      </div>
    </React.Fragment>
  );
};

YTPlayerPage.propTypes = {
  ytplayer: PropTypes.object,
  ytplaylist: PropTypes.object
};

const mapStateToProps = ({ ytplayer, ytplaylist }) => ({
  ytplayer,
  ytplaylist
});

export default connect(
  mapStateToProps,
  {}
)(YTPlayerPage);
