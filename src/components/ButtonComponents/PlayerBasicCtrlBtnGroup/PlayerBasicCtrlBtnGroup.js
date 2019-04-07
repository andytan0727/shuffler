import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import LoopIcon from "@material-ui/icons/Loop";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import { useKeyDown } from "../../../utils/helper/keyboardShortcutHelper";

import { setCurSongIdx } from "../../../store/ytplayer/action";
import { shufflePlaylist } from "../../../store/ytplaylist/action";
import { notify } from "../../../utils/helper/notifyHelper";

import styles from "./styles.module.scss";

const PlayerBasicCtrlBtnGroup = (props) => {
  const {
    playing,
    curSongIdx,
    listToPlay,
    setCurSongIdx,
    shufflePlaylist,

    // own props
    ytPlayerRef,
  } = props;

  const handlePrevious = () => {
    if (curSongIdx > 0) {
      setCurSongIdx(curSongIdx - 1);
      return;
    }
    notify("warning", "💢 This is the first video in your playlist!");
  };

  const handlePlay = () => {
    if (ytPlayerRef) {
      ytPlayerRef.current.internalPlayer.playVideo();
    }
  };

  const handlePause = () => {
    if (ytPlayerRef) {
      ytPlayerRef.current.internalPlayer.pauseVideo();
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

  // fix play/pause problem when spacebar is pressed after clicking buttons
  const handleBlur = (e) => {
    e.target.blur();
  };

  const playerKeyboardShortcuts = async (e) => {
    const keyCode = e.keyCode;
    const arrowCode = { left: 37, up: 38, right: 39, down: 40 };

    // spacekey (play/pause)
    if (keyCode === 32 || e.keyC === " " || e.key === "Spacebar") {
      // blur anything else to prevent spacebar bugs
      handleBlur(e);

      if (playing) {
        handlePause();
        return;
      }

      if (!playing) {
        handlePlay();
        return;
      }
    }

    if (e.ctrlKey) {
      // ctrl+alt+s (shuffle playing list)
      if (e.ctrlKey && e.altKey && e.key === "s") {
        handleShufflePlaylist();
        return;
      }

      // ctrl+arrow (fast forward/backward)
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
      const curVolume = await ytPlayerRef.current.internalPlayer.getVolume();

      switch (keyCode) {
        case arrowCode.up: {
          if (curVolume >= 100) {
            return;
          }
          ytPlayerRef.current.internalPlayer.setVolume(curVolume + 5);
          break;
        }

        case arrowCode.down: {
          if (curVolume <= 0) {
            return;
          }
          ytPlayerRef.current.internalPlayer.setVolume(curVolume - 5);
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

  return (
    <div className={styles.ctrlBtnGroup}>
      {/* TODO: */}
      <IconButton aria-label="Loop">
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
          onKeyDown={handleBlur}
        >
          <PlayArrowIcon className={styles.playPauseIcon} />
        </IconButton>
      ) : (
        <IconButton
          aria-label="Pause"
          onClick={handlePause}
          onKeyDown={handleBlur}
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
  );
};

PlayerBasicCtrlBtnGroup.propTypes = {
  playing: PropTypes.bool.isRequired,
  curSongIdx: PropTypes.number.isRequired,
  listToPlay: PropTypes.array,
  setCurSongIdx: PropTypes.func.isRequired,
  shufflePlaylist: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const {
    ytplayer: { playing, curSongIdx },
    ytplaylist: { listToPlay },
  } = state;
  return {
    playing,
    curSongIdx,
    listToPlay,
  };
};

export default connect(
  mapStateToProps,
  {
    setCurSongIdx,
    shufflePlaylist,
  }
)(PlayerBasicCtrlBtnGroup);
