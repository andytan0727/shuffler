import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import YouTube from "react-youtube";
import IconButton from "@material-ui/core/IconButton";
import LoopIcon from "@material-ui/icons/Loop";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import PauseIcon from "@material-ui/icons/Pause";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import { useKeyDown } from "../../../../utils/helper/keyboardShortcutHelper";

import { setCurSongIdx, setVideoPlaying } from "../../../../store/ytplayer/action";
import { shufflePlaylist } from "../../../../store/ytplaylist/action";
import { notify } from "../../../../utils/helper/notifyHelper";

import styles from "./styles.module.scss";

const VideoPlayer = (props) => {
  const {
    playing,
    curSongIdx,
    playerVars,
    listToPlay,
    setCurSongIdx,
    setVideoPlaying,
    shufflePlaylist,
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

  // focus window to listen for keyboard shortcuts
  // fix the problem of unable to trigger keydown event
  // when YT IFrame is focused
  const setFocusWindow = () => window.focus();

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

  const handleShufflePlaylist = () => {
    shufflePlaylist();
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

  const playerKeyboardShortcuts = async (e) => {
    const keyCode = e.keyCode;
    const arrowCode = { left: 37, up: 38, right: 39, down: 40 };

    // spacekey (play/pause)
    if (keyCode === 32 || e.keyC === " " || e.key === "Spacebar") {
      // blur anything else to prevent spacebar bugs
      e.target.blur();

      if (playing) {
        handlePause();
        return;
      }

      if (!playing) {
        handlePlay();
        return;
      }
    }

    // ctrl+alt+s (shuffle playing list)
    if (e.ctrlKey && e.altKey && e.key === "s") {
      handleShufflePlaylist();
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

  // handle keyboard shortcuts for controlling player
  useKeyDown(playerKeyboardShortcuts);

  useEffect(() => {
    window.addEventListener("resize", _setVidSize);

    return () => {
      // remove listeners
      window.removeEventListener("resize", _setVidSize);

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
            onStateChange={setFocusWindow}
            onEnd={handleNext}
            onError={handleVideoError}
          />
          <div className={styles.ctrlBtnGroup}>
            <IconButton aria-label="Loop" onClick={() => console.log("loop")}>
              <LoopIcon />
            </IconButton>
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
            <IconButton aria-label="Shuffle" onClick={handleShufflePlaylist}>
              <ShuffleIcon />
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
  shufflePlaylist: PropTypes.func.isRequired,
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
    shufflePlaylist,
  }
)(VideoPlayer);
