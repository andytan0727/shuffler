import React, { useCallback } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";

// Material Icons
import IconButton from "@material-ui/core/IconButton";
import LoopIcon from "@material-ui/icons/Loop";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ShuffleIcon from "@material-ui/icons/Shuffle";

import { useKeyDown } from "../../../utils/helper/keyboardShortcutHelper";
import { setCurSongIdx, toggleRepeat } from "../../../store/ytplayer/action";
import { shuffleListToPlayAction } from "../../../store/ytplaylist/action";
import { notify } from "../../../utils/helper/notifyHelper";

import styles from "./styles.module.scss";

const PlayerBasicCtrlBtnGroup = (props) => {
  const {
    playing,
    repeat,
    curSongIdx,
    listToPlay,
    setCurSongIdx,
    shuffleListToPlayAction,
    toggleRepeat,

    // own props
    ytPlayerRef,
  } = props;

  const handlePrevious = useCallback(() => {
    if (curSongIdx > 0) {
      setCurSongIdx(curSongIdx - 1);
      return;
    }
    notify("warning", "💢 This is the first video in your playlist!");
  }, [curSongIdx, setCurSongIdx]);

  const handlePlay = useCallback(() => {
    if (ytPlayerRef) {
      ytPlayerRef.current.internalPlayer.playVideo();
    }
  }, [ytPlayerRef]);

  const handlePause = useCallback(() => {
    if (ytPlayerRef) {
      ytPlayerRef.current.internalPlayer.pauseVideo();
    }
  }, [ytPlayerRef]);

  const handleNext = useCallback(() => {
    if (curSongIdx === listToPlay.length - 1) {
      notify("info", "🚀 You have reached last video in your playlist");
      return;
    }

    setCurSongIdx(curSongIdx + 1);
  }, [curSongIdx, listToPlay.length, setCurSongIdx]);

  const handleShufflePlaylist = useCallback(() => {
    shuffleListToPlayAction();
    setCurSongIdx(0);
  }, [setCurSongIdx, shuffleListToPlayAction]);

  // fix play/pause problem when spacebar is pressed after clicking buttons
  const handleBlur = useCallback((e) => {
    e.target.blur();
  }, []);

  const playerKeyboardShortcuts = useCallback(
    async (e) => {
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
    },
    [
      handleBlur,
      handleNext,
      handlePause,
      handlePlay,
      handlePrevious,
      handleShufflePlaylist,
      playing,
      ytPlayerRef,
    ]
  );

  // handle keyboard shortcuts for controlling player
  useKeyDown(playerKeyboardShortcuts);

  return (
    <div className={styles.ctrlBtnGroup}>
      <IconButton onClick={toggleRepeat} aria-label="Loop">
        <LoopIcon
          className={classNames({
            [styles.toggledRepeat]: repeat,
          })}
        />
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
  repeat: PropTypes.bool.isRequired,
  curSongIdx: PropTypes.number.isRequired,
  listToPlay: PropTypes.array,
  setCurSongIdx: PropTypes.func.isRequired,
  shuffleListToPlayAction: PropTypes.func.isRequired,
  toggleRepeat: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const {
    ytplayer: { playing, repeat, curSongIdx },
    ytplaylist: { listToPlay },
  } = state;
  return {
    playing,
    repeat,
    curSongIdx,
    listToPlay,
  };
};

export default connect(
  mapStateToProps,
  {
    setCurSongIdx,
    shuffleListToPlayAction,
    toggleRepeat,
  }
)(PlayerBasicCtrlBtnGroup);
