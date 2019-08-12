import classNames from "classnames";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurSongIdx, toggleRepeat } from "store/ytplayer/action";
import {
  selectCurSongIdx,
  selectPlaying,
  selectRepeat,
} from "store/ytplayer/selector";
import { shuffleListToPlayAction } from "store/ytplaylist/normAction";
import { selectNormListToPlayResultSnippets } from "store/ytplaylist/normSelector";
import { useKeyDown } from "utils/helper/keyboardShortcutHelper";
import { notify } from "utils/helper/notifyHelper";

import { IconButton } from "@material-ui/core";
import {
  Loop as LoopIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Shuffle as ShuffleIcon,
  SkipNext as SkipNextIcon,
  SkipPrevious as SkipPreviousIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

interface PlayerBasicCtrlBtnGroupProps {
  ytPlayerRef: any;
}

const PlayerBasicCtrlBtnGroup = (props: PlayerBasicCtrlBtnGroupProps) => {
  const { ytPlayerRef } = props;
  const curSongIdx = useSelector(selectCurSongIdx);
  const playing = useSelector(selectPlaying);
  const repeat = useSelector(selectRepeat);
  const dispatch = useDispatch();

  const listToPlaySnippets = useSelector(selectNormListToPlayResultSnippets);

  const handlePrevious = useCallback(() => {
    if (curSongIdx > 0) {
      dispatch(setCurSongIdx(curSongIdx - 1));
      return;
    }
    notify("warning", "💢 This is the first video in your playlist!");
  }, [curSongIdx, dispatch]);

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
    if (curSongIdx === listToPlaySnippets.length - 1) {
      notify("info", "🚀 You have reached last video in your playlist");
      return;
    }

    dispatch(setCurSongIdx(curSongIdx + 1));
  }, [curSongIdx, dispatch, listToPlaySnippets.length]);

  const handleShufflePlaylist = useCallback(() => {
    dispatch(shuffleListToPlayAction());
    dispatch(setCurSongIdx(0));
  }, [dispatch]);

  const handleToggle = useCallback(() => {
    dispatch(toggleRepeat());
  }, [dispatch]);

  // fix play/pause problem when Spacebar is pressed after clicking buttons
  const handleBlur = useCallback((e) => {
    e.target.blur();
  }, []);

  const playerKeyboardShortcuts = useCallback(
    async (e) => {
      const keyCode = e.keyCode;
      const arrowCode = { left: 37, up: 38, right: 39, down: 40 };

      // SpaceKey (play/pause)
      if (keyCode === 32 || e.keyC === " " || e.key === "Spacebar") {
        // blur anything else to prevent Spacebar bugs
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
      <IconButton onClick={handleToggle} aria-label="Loop">
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
        disabled={curSongIdx === listToPlaySnippets.length - 1}
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

export default PlayerBasicCtrlBtnGroup;
