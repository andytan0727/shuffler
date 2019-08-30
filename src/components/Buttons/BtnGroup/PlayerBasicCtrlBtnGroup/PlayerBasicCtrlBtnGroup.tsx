import classNames from "classnames";
import { useMediaControl } from "components/Players/hooks/useMediaControl";
import React from "react";
import { useSelector } from "react-redux";
import YouTube from "react-youtube";
import {
  selectCurSongIdx,
  selectPlaying,
  selectRepeat,
} from "store/ytplayer/selector";
import { selectListToPlayTotalItems } from "store/ytplaylist/listToPlaySelectors";

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
  ytPlayerRef: React.Ref<YouTube>;
}

const PlayerBasicCtrlBtnGroup = (props: PlayerBasicCtrlBtnGroupProps) => {
  const { ytPlayerRef } = props;
  const curSongIdx = useSelector(selectCurSongIdx);
  const playing = useSelector(selectPlaying);
  const repeat = useSelector(selectRepeat);
  const listToPlaySnippetsCount = useSelector(selectListToPlayTotalItems);
  const {
    handlePrevious,
    handlePlay,
    handlePause,
    handleNext,
    handleShuffleListToPlay,
    handleToggleRepeat,
    handleBlur,
  } = useMediaControl(ytPlayerRef);

  return (
    <div className={styles.ctrlBtnGroup}>
      <IconButton onClick={handleToggleRepeat} aria-label="Loop">
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
        disabled={curSongIdx === listToPlaySnippetsCount - 1}
        aria-label="Next"
        onClick={handleNext}
      >
        <SkipNextIcon />
      </IconButton>
      <IconButton aria-label="Shuffle" onClick={handleShuffleListToPlay}>
        <ShuffleIcon />
      </IconButton>
    </div>
  );
};

export default PlayerBasicCtrlBtnGroup;
