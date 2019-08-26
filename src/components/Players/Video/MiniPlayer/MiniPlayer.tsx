import classNames from "classnames";
import { PlayerBasicCtrlBtnGroup } from "components/Buttons";
import { MiniPlayerList } from "components/Lists";
import YouTubeIFrame from "components/Players/YouTubeIFrame";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { animated, useTransition } from "react-spring";
import { selectPreferDarkTheme } from "store/userPreferences/selector";
import { setCurSongIdx } from "store/ytplayer/action";
import { selectCurSongIdx, selectPlaying } from "store/ytplayer/selector";
import { selectListToPlayResultSnippets } from "store/ytplaylist/listToPlaySelectors";
import { setEscOverlay, useKeyDown } from "utils/helper/keyboardShortcutHelper";

import {
  Close as CloseIcon,
  List as ListIcon,
  MusicVideo as MusicVideoIcon,
  PlayArrow as PlayArrowIcon,
  PlayCircleFilled as PlayCircleIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

const MiniPlayer = () => {
  const ytPlayerRef = useRef<any>(null);
  const curSongIdx = useSelector(selectCurSongIdx);
  const listToPlaySnippets = useSelector(selectListToPlayResultSnippets);
  const playing = useSelector(selectPlaying);
  const preferDarkTheme = useSelector(selectPreferDarkTheme);
  const dispatch = useDispatch();
  const [curDisplayIdx, setCurDisplayIdx] = useState(curSongIdx);
  const [blurBg, setBlurBg] = useState(false);
  const [showYT, setShowYT] = useState(false);
  const [showMiniPlayerList, setShowMiniPlayerList] = useState(false);
  const transitions = useTransition(showMiniPlayerList, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const currentSnippet = listToPlaySnippets[curSongIdx];
  const songListLen = listToPlaySnippets.length;

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

  const handleShowYT = useCallback((e) => {
    e.preventDefault();
    setShowYT(true);
    setBlurBg(true);
  }, []);

  const handleHideYT = useCallback((e) => {
    e.preventDefault();
    setShowYT(false);
    setBlurBg(false);
  }, []);

  const handleShowMiniPlayerList = useCallback((e) => {
    e.preventDefault();
    setShowMiniPlayerList(true);
    setBlurBg(true);
  }, []);

  const handleHideMiniPlayerList = useCallback((e) => {
    e.preventDefault();
    setShowMiniPlayerList(false);
    setBlurBg(false);
  }, []);

  // set shortcut to close YT overlay
  useKeyDown(setEscOverlay(handleHideYT));

  useEffect(() => {
    setCurDisplayIdx(curSongIdx);
  }, [curSongIdx]);

  useEffect(() => {
    return () => {
      dispatch(setCurSongIdx(0));
    };
  }, [dispatch]);

  return (
    <React.Fragment>
      <div
        className={classNames(styles.miniPlayerDiv, {
          [styles.blurBg]: blurBg,
        })}
      >
        <div
          className={preferDarkTheme ? styles.playerDark : styles.playerLight}
        >
          <h3>{currentSnippet.title}</h3>
          <div
            className={classNames(styles.thumbnailDiv, styles.thumbnailRotate, {
              [styles.thumbnailPlaying]: playing,
              [styles.rotation]: playing,
              [styles.paused]: !playing,
              [styles.thumbnailDarkPlaying]: playing && preferDarkTheme,
            })}
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              backgroundColor: "white",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundImage: `url(${currentSnippet.thumbnails &&
                currentSnippet.thumbnails.high.url})`,
              transition: "box-shadow 750ms linear",
            }}
          />

          <PlayerBasicCtrlBtnGroup ytPlayerRef={ytPlayerRef} />
        </div>
        <div
          className={
            preferDarkTheme ? styles.playlistDark : styles.playlistLight
          }
          data-cursong={curSongIdx + 1}
          data-listlen={songListLen}
          onWheel={handleWheel}
        >
          <div className={styles.listButtonDiv}>
            <button onClick={handleSetCurDisplayIdx}>
              <MusicVideoIcon />
            </button>
            <button onClick={handleShowYT}>
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
                [styles.curSongPlaying]:
                  playing && curSongIdx === curDisplayIdx,
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
      </div>

      {/* YT IFrame that display none */}
      <div
        className={classNames({
          [styles.hideYTIframe]: !showYT,
          [styles.showYTIframe]: showYT,
        })}
      >
        <button className={styles.closeButton} onClick={handleHideYT}>
          <CloseIcon />
        </button>
        <YouTubeIFrame ref={ytPlayerRef} />
        <PlayerBasicCtrlBtnGroup ytPlayerRef={ytPlayerRef} />
      </div>
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div
              key={key}
              style={{ position: "relative", zIndex: 2, ...props }}
            >
              <MiniPlayerList
                handleHideMiniPlayerList={handleHideMiniPlayerList}
              />
            </animated.div>
          )
      )}
    </React.Fragment>
  );
};

export default MiniPlayer;
