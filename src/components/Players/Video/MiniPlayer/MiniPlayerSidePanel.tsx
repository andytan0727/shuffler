import classNames from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPreferDarkTheme } from "store/userPreferences/selector";
import { setCurSongIdx } from "store/ytplayer/action";
import { selectCurSongIdx } from "store/ytplayer/selector";
import {
  selectListToPlayResultSnippets,
  selectListToPlayTotalItems,
} from "store/ytplaylist/listToPlaySelectors";

import {
  List as ListIcon,
  MusicVideo as MusicVideoIcon,
  PlayArrow as PlayArrowIcon,
  PlayCircleFilled as PlayCircleIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

interface MiniPlayerSidePanelProps {
  handleShowYTOverlay: (e: OnClickEvent) => void;
  handleShowMiniPlayerList: (e: OnClickEvent) => void;
  playing: boolean;
}

const MiniPlayerSidePanel = (props: MiniPlayerSidePanelProps) => {
  const { handleShowYTOverlay, handleShowMiniPlayerList, playing } = props;

  const curSongIdx = useSelector(selectCurSongIdx);
  const [curDisplayIdx, setCurDisplayIdx] = useState(curSongIdx);
  const preferDarkTheme = useSelector(selectPreferDarkTheme);
  const listToPlaySnippets = useSelector(selectListToPlayResultSnippets);
  const songListLen = useSelector(selectListToPlayTotalItems);
  const dispatch = useDispatch();

  const handleWheel = useCallback(
    (e) => {
      const deltaY = e.deltaY;

      if (deltaY > 0 && curDisplayIdx < songListLen - 1) {
        setCurDisplayIdx(curDisplayIdx + 1);
      }

      if (deltaY < 0 && curDisplayIdx > 0) {
        setCurDisplayIdx(curDisplayIdx - 1);
      }
    },
    [curDisplayIdx, songListLen]
  );

  const handlePlayClicked = useCallback(() => {
    dispatch(setCurSongIdx(curDisplayIdx));
  }, [curDisplayIdx, dispatch]);

  const handleSetCurDisplayIdx = useCallback(
    (e) => {
      e.preventDefault();
      setCurDisplayIdx(curSongIdx);
    },
    [curSongIdx]
  );

  useEffect(() => {
    setCurDisplayIdx(curSongIdx);
  }, [curSongIdx]);

  return (
    <div
      className={preferDarkTheme ? styles.playlistDark : styles.playlistLight}
      data-cursong={curSongIdx + 1}
      data-listlen={songListLen}
      onWheel={handleWheel}
    >
      <div className={styles.listButtonDiv}>
        <button onClick={handleSetCurDisplayIdx}>
          <MusicVideoIcon />
        </button>
        <button onClick={handleShowYTOverlay}>
          <PlayCircleIcon />
        </button>
        <button onClick={handleShowMiniPlayerList}>
          <ListIcon />
        </button>
      </div>
      <ul>
        <li>
          {listToPlaySnippets[curDisplayIdx - 2] &&
            listToPlaySnippets[curDisplayIdx - 2]!.title}
        </li>
        <li>
          {listToPlaySnippets[curDisplayIdx - 1] &&
            listToPlaySnippets[curDisplayIdx - 1]!.title}
        </li>
        <li
          className={classNames({
            [styles.curSongPlaying]: playing && curSongIdx === curDisplayIdx,
          })}
          onClick={handlePlayClicked}
        >
          {curSongIdx === curDisplayIdx && playing && <PlayArrowIcon />}
          {listToPlaySnippets[curDisplayIdx] &&
            listToPlaySnippets[curDisplayIdx]!.title}
        </li>
        <li>
          {listToPlaySnippets[curDisplayIdx + 1] &&
            listToPlaySnippets[curDisplayIdx + 1]!.title}
        </li>
        <li>
          {listToPlaySnippets[curDisplayIdx + 2] &&
            listToPlaySnippets[curDisplayIdx + 2]!.title}
        </li>
      </ul>
    </div>
  );
};

export default MiniPlayerSidePanel;
