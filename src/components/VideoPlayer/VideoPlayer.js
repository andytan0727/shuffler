import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import YouTube from "react-youtube";
import Button from "@material-ui/core/Button";

import { toggleYTPlaying, setCurSongIdx } from "../../store/ytplayer/action";

import styles from "./styles.module.scss";

const VideoPlayer = props => {
  const {
    playing,
    curSongIdx,
    playerVars,
    listToPlay,
    toggleYTPlaying,
    setCurSongIdx
  } = props;
  const ytPlayer = useRef(null);

  const handlePrevious = () => {
    if (curSongIdx > 0) {
      setCurSongIdx(curSongIdx - 1);
      return;
    }
    alert("This is the first video");
  };

  const handlePlay = e => {
    e.preventDefault();

    if (ytPlayer) {
      ytPlayer.current.internalPlayer.playVideo();
      toggleYTPlaying();
    }
  };

  const handlePause = e => {
    e.preventDefault();

    if (ytPlayer) {
      ytPlayer.current.internalPlayer.pauseVideo();
      toggleYTPlaying();
    }
  };

  const handleNext = () => {
    setCurSongIdx(curSongIdx + 1);
  };

  useEffect(() => {
    // return () => {
    //   ytPlayer.current.internalPlayer.destroy();
    // };
  });

  return (
    <React.Fragment>
      {listToPlay.length !== 0 && (
        <div id={"player"}>
          <YouTube
            ref={ytPlayer}
            videoId={listToPlay[curSongIdx].snippet.resourceId.videoId}
            opts={{
              playerVars: {
                ...playerVars
                // list: "PL6nn1koAbIR_g6wG0CV2p-LgaOw2Lp9ON"
              }
            }}
            onReady={toggleYTPlaying}
            onEnd={handleNext} // defaults -> noop
          />
          <div className={styles.ctrlBtnGroup}>
            <Button
              variant="outlined"
              color="primary"
              aria-label="previous"
              onClick={handlePrevious}
            >
              Previous
            </Button>
            {!playing ? (
              <Button
                variant="outlined"
                color="primary"
                aria-label="play"
                onClick={handlePlay}
              >
                Play
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                aria-label="pause"
                onClick={handlePause}
              >
                Pause
              </Button>
            )}
            <Button
              variant="outlined"
              color="primary"
              aria-label="next"
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

VideoPlayer.propTypes = {
  playing: PropTypes.bool.isRequired,
  curSongIdx: PropTypes.number.isRequired,
  playerVars: PropTypes.object.isRequired,
  listToPlay: PropTypes.array,
  toggleYTPlaying: PropTypes.func.isRequired,
  setCurSongIdx: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const {
    ytplayer: { playing, curSongIdx, playerVars },
    ytplaylist: { listToPlay }
  } = state;
  return {
    playing,
    curSongIdx,
    playerVars,
    listToPlay
  };
};

export default connect(
  mapStateToProps,
  {
    toggleYTPlaying,
    setCurSongIdx
  }
)(VideoPlayer);
