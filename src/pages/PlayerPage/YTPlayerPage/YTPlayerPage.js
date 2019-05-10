import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import VideoPlayer from "../../../components/Players/Video/VideoPlayer";
import PlayerPageList from "./PlayerPageList";
import NoVideoFound from "../NoVideoFound";
import { setCurSongIdx } from "../../../store/ytplayer/action";

import styles from "./styles.module.scss";

const YTPlayerPage = (props) => {
  const {
    ytplayer: { curSongIdx },
    ytplaylist: { listToPlay },
    setCurSongIdx,
  } = props;

  useEffect(() => {
    // reset curSongIdx to prevent bugs when routing pages
    setCurSongIdx(0);

    return () => {
      // also reset curSongIdx when unmounting
      setCurSongIdx(0);
    };
  }, []);

  return (
    <React.Fragment>
      {listToPlay.length !== 0 ? (
        <div className={styles.ytPlayerDiv}>
          <div id="vid-wrapper" className={styles.player}>
            <h3 className={styles.videoTitle}>
              {listToPlay[curSongIdx].snippet.title}
            </h3>
            <VideoPlayer />
          </div>
          <div className={styles.playlist}>
            <PlayerPageList />
          </div>
        </div>
      ) : (
        <NoVideoFound />
      )}
    </React.Fragment>
  );
};

YTPlayerPage.propTypes = {
  ytplayer: PropTypes.object,
  ytplaylist: PropTypes.object,
};

const mapStateToProps = ({ ytplayer, ytplaylist }) => ({
  ytplayer,
  ytplaylist,
});

export default connect(
  mapStateToProps,
  {
    setCurSongIdx,
  }
)(YTPlayerPage);
