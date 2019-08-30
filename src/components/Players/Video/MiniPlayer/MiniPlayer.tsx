import classNames from "classnames";
import { PlayerBasicCtrlBtnGroup } from "components/Buttons";
import { MiniPlayerList } from "components/Lists";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { animated, useTransition } from "react-spring";
import { selectPreferDarkTheme } from "store/userPreferences/selector";
import { setCurSongIdx } from "store/ytplayer/action";
import { selectCurSongIdx, selectPlaying } from "store/ytplayer/selector";
import { selectListToPlayResultSnippets } from "store/ytplaylist/listToPlaySelectors";
import { setEscOverlay, useKeyDown } from "utils/helper/keyboardShortcutHelper";

import MiniPlayerSidePanel from "./MiniPlayerSidePanel";
import styles from "./styles.module.scss";
import YTIFrameOverlay from "./YTIFrameOverlay";

const MiniPlayer = () => {
  const ytPlayerRef = useRef<any>(null);
  const curSongIdx = useSelector(selectCurSongIdx);
  const listToPlaySnippets = useSelector(selectListToPlayResultSnippets);
  const playing = useSelector(selectPlaying);
  const preferDarkTheme = useSelector(selectPreferDarkTheme);
  const dispatch = useDispatch();
  const [blurBg, setBlurBg] = useState(false);
  const [showYT, setShowYT] = useState(false);
  const [showMiniPlayerList, setShowMiniPlayerList] = useState(false);
  const transitions = useTransition(showMiniPlayerList, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });
  const currentSnippet = listToPlaySnippets[curSongIdx];

  const handleShowYTOverlay = useCallback((e) => {
    e.preventDefault();
    setShowYT(true);
    setBlurBg(true);
  }, []);

  const handleHideYTOverlay = useCallback((e: OnClickEvent) => {
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
  useKeyDown(setEscOverlay(handleHideYTOverlay));

  // reset playlist current song to first song after unmounted
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

        <MiniPlayerSidePanel
          handleShowMiniPlayerList={handleShowMiniPlayerList}
          handleShowYTOverlay={handleShowYTOverlay}
          playing={playing}
        />
      </div>

      {/* YT IFrame that display none */}
      <YTIFrameOverlay
        showYT={showYT}
        handleHideYTOverlay={handleHideYTOverlay}
        ytPlayerRef={ytPlayerRef}
      />

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
