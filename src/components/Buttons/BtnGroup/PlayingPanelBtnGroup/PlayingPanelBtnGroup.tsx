import classNames from "classnames";
import React from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { selectPreferDarkTheme } from "store/userPreferences/selector";
import {
  useClearListToPlay,
  usePlayListToPlay,
  useShuffleListToPlay,
} from "utils/hooks/listToPlayHooks";

import {
  Clear as ClearIcon,
  PlayArrow as PlayArrowIcon,
  Shuffle as ShuffleIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

const PlayingPanelBtnGroup = (props: RouteComponentProps) => {
  const { history } = props;
  const preferDarkTheme = useSelector(selectPreferDarkTheme);
  const { handlePlayListToPlay } = usePlayListToPlay(history);
  const { handleShuffleListToPlay } = useShuffleListToPlay();
  const { handleClearListToPlay } = useClearListToPlay();

  return (
    <div
      className={classNames({
        [styles.playingPanelBtnGroupLight]: !preferDarkTheme,
        [styles.playingPanelBtnGroupDark]: preferDarkTheme,
      })}
    >
      <button onClick={handlePlayListToPlay} data-tooltip="Play">
        <PlayArrowIcon />
      </button>
      <button
        onClick={handleShuffleListToPlay}
        data-tooltip="Shuffle playing list"
      >
        <ShuffleIcon />
      </button>
      <button onClick={handleClearListToPlay} data-tooltip="Clear playing list">
        <ClearIcon />
      </button>
    </div>
  );
};

export default withRouter(PlayingPanelBtnGroup);
