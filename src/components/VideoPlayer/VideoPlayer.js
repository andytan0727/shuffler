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

import {
  setCurSongIdx,
  setVideoPlaying
} from "../../store/ytplayer/action";

import styles from "./styles.module.scss";

const VideoPlayer = props => {
  const {
    playing,
    curSongIdx,
    playerVars,
    listToPlay,
    setCurSongIdx,
    setVideoPlaying
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

  const setPlaying = () => setVideoPlaying(true);

  const setPause = () => setVideoPlaying(false);

  const handlePlay = e => {
    e.preventDefault();

    if (ytPlayer) {
      ytPlayer.current.internalPlayer.playVideo();
    }
  };

  const handlePause = e => {
    e.preventDefault();

    if (ytPlayer) {
      ytPlayer.current.internalPlayer.pauseVideo();
    }
  };

  const handleNext = () => {
    if (curSongIdx === listToPlay.length - 1) {
      alert("You have reached last song in the playlist");
      return;
    }

    setCurSongIdx(curSongIdx + 1);
  };

  const handleVideoError = e => {
    switch (e.data) {
      case 101:
      case 150:
        // skip to next song when video playback in iframe is prohibited
        handleNext();
        break;
      default:
        console.log("error code: " + e.data);
    }
  };

  useEffect(() => {
    // Destroy player when unmount
    return () => {
      ytPlayer.current.internalPlayer.destroy();
    };
  }, []);

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
              }
            }}
            onReady={setPlaying}
            onPlay={setPlaying}
            onPause={setPause}
            onEnd={handleNext}
            onError={handleVideoError}
          />
          <div className={styles.ctrlBtnGroup}>
            <IconButton
              disabled={curSongIdx === 0}
              aria-label="Previous"
              onClick={handlePrevious}
            >
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
            <IconButton
              disabled={curSongIdx === listToPlay.length - 1}
              aria-label="Next"
              onClick={handleNext}
            >
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
  setCurSongIdx: PropTypes.func.isRequired,
  setVideoPlaying: PropTypes.func.isRequired
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
    setCurSongIdx,
    setVideoPlaying
  }
)(VideoPlayer);
