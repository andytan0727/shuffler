import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import YouTube from "react-youtube";
import IconButton from "@material-ui/core/IconButton";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import PauseIcon from "@material-ui/icons/Pause";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

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
  const matchesMobile = useMediaQuery("(max-width: 420px)");

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
        <div id="player" className={styles.playerWrapper}>
          <YouTube
            ref={ytPlayer}
            videoId={listToPlay[curSongIdx].snippet.resourceId.videoId}
            opts={{
              width: matchesMobile ? 250 : 640,
              height: matchesMobile ? 180 : 390,
              playerVars: {
                ...playerVars
                // list: "PL6nn1koAbIR_g6wG0CV2p-LgaOw2Lp9ON"
              }
            }}
            onReady={toggleYTPlaying}
            onEnd={handleNext} // defaults -> noop
          />
          <div className={styles.ctrlBtnGroup}>
            <IconButton aria-label="Previous" onClick={handlePrevious}>
              <SkipPreviousIcon />
            </IconButton>
            {!playing ? (
              <IconButton aria-label="Play" onClick={handlePlay}>
                <PlayArrowIcon className={styles.playPauseIcon} />
              </IconButton>
            ) : (
              <IconButton aria-label="Play" onClick={handlePause}>
                <PauseIcon className={styles.playPauseIcon} />
              </IconButton>
            )}
            <IconButton aria-label="Next" onClick={handleNext}>
              <SkipNextIcon />
            </IconButton>
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
