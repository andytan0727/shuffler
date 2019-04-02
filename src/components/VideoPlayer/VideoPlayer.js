import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import YouTube from "react-youtube";
import IconButton from "@material-ui/core/IconButton";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import PauseIcon from "@material-ui/icons/Pause";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import { setCurSongIdx, setVideoPlaying } from "../../store/ytplayer/action";
import { notify } from "../../utils/helper/notifyHelper";

import styles from "./styles.module.scss";

const VideoPlayer = (props) => {
  const {
    playing,
    curSongIdx,
    playerVars,
    listToPlay,
    setCurSongIdx,
    setVideoPlaying,
  } = props;
  const ytPlayer = useRef(null);
  const matchesMobile = useMediaQuery("(max-width: 420px)");
  const [vidWidth, setVidWidth] = useState(0);

  const handlePrevious = () => {
    if (curSongIdx > 0) {
      setCurSongIdx(curSongIdx - 1);
      return;
    }
    notify("warning", "💢 This is the first video in your playlist!");
  };

  const setPlaying = () => setVideoPlaying(true);

  const setPause = () => setVideoPlaying(false);

  const handlePlay = () => {
    if (ytPlayer) {
      ytPlayer.current.internalPlayer.playVideo();
    }
  };

  const handlePause = () => {
    if (ytPlayer) {
      ytPlayer.current.internalPlayer.pauseVideo();
    }
  };

  const handleNext = () => {
    if (curSongIdx === listToPlay.length - 1) {
      notify("info", "🚀 You have reached last video in your playlist");
      return;
    }

    setCurSongIdx(curSongIdx + 1);
  };

  const handleVideoError = (e) => {
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

  const _setVidSize = () => {
    const vidWrapper = document.getElementById("vid-wrapper");
    setVidWidth(vidWrapper.width);
  };

  // fix play/pause problem when spacebar is pressed after clicking buttons
  const handleBlurButton = (e) => {
    e.target.blur();
  };

  const keyboardShortcuts = async (e) => {
    const keyCode = e.keyCode;
    const arrowCode = { left: 37, up: 38, right: 39, down: 40 };

    // spacekey (play/pause)
    if (keyCode === 32 || e.keyC === " " || e.key === "Spacebar") {
      if (playing) {
        handlePause();
        return;
      }

      if (!playing) {
        handlePlay();
        return;
      }
    }

    // ctrl+arrow (fast forward/backward)
    if (e.ctrlKey) {
      switch (keyCode) {
        case arrowCode.left: {
          handlePrevious();
          break;
        }

        case arrowCode.right: {
          handleNext();
          break;
        }

        default: {
          break;
        }
      }
      return;
    }

    // arrow (volume)
    if (keyCode >= arrowCode.left && keyCode <= arrowCode.down) {
      const curVolume = await ytPlayer.current.internalPlayer.getVolume();

      switch (keyCode) {
        case arrowCode.up: {
          if (curVolume >= 100) {
            return;
          }
          ytPlayer.current.internalPlayer.setVolume(curVolume + 5);
          break;
        }

        case arrowCode.down: {
          if (curVolume <= 0) {
            return;
          }
          ytPlayer.current.internalPlayer.setVolume(curVolume - 5);
          break;
        }

        default: {
          break;
        }
      }
      return;
    }
  };

  // -----------------------------------------
  // solve Redux state update problem due to javascript closure
  // details: https://www.reddit.com/r/reactjs/comments/9zupzn/why_would_i_use_react_hooks_where_the_seteffect/ @VariadicIntegrity
  const onKeyDownHandlerRef = useRef(keyboardShortcuts);

  useEffect(() => {
    onKeyDownHandlerRef.current = keyboardShortcuts;
  }, [keyboardShortcuts]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      onKeyDownHandlerRef.current(e);
    };

    window.addEventListener("resize", _setVidSize);

    // regsister keyboard shortcuts
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // remove listeners
      window.removeEventListener("resize", _setVidSize);
      window.removeEventListener("keydown", handleKeyDown);

      // Destroy player when unmount
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
              width: matchesMobile ? vidWidth : 640,
              height: matchesMobile ? 180 : 390,
              playerVars: {
                ...playerVars,
              },
            }}
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
              <IconButton
                aria-label="Play"
                onClick={handlePlay}
                onKeyDown={handleBlurButton}
              >
                <PlayArrowIcon className={styles.playPauseIcon} />
              </IconButton>
            ) : (
              <IconButton
                aria-label="Play"
                onClick={handlePause}
                onKeyDown={handleBlurButton}
              >
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
  setVideoPlaying: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const {
    ytplayer: { playing, curSongIdx, playerVars },
    ytplaylist: { listToPlay },
  } = state;
  return {
    playing,
    curSongIdx,
    playerVars,
    listToPlay,
  };
};

export default connect(
  mapStateToProps,
  {
    setCurSongIdx,
    setVideoPlaying,
  }
)(VideoPlayer);
