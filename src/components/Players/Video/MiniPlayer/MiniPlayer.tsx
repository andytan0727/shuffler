import classNames from "classnames";
import { PlayerBasicCtrlBtnGroup } from "components/Buttons";
import { LargePlaylist } from "components/Lists";
import YouTubeIFrame from "components/Players/YouTubeIFrame";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect, useSelector } from "react-redux";
import { animated, useTransition } from "react-spring";
import { AppState } from "store";
import { setCurSongIdx } from "store/ytplayer/action";
import { selectNormListToPlayResultSnippets } from "store/ytplaylist/normSelector";
import { setEscOverlay, useKeyDown } from "utils/helper/keyboardShortcutHelper";

import {
  Close as CloseIcon,
  List as ListIcon,
  MusicVideo as MusicVideoIcon,
  PlayArrow as PlayArrowIcon,
  PlayCircleFilled as PlayCircleIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

interface MiniPlayerConnectedState {
  preferDarkTheme: boolean;
  playing: boolean;
  curSongIdx: number;
}

interface MiniPlayerConnectedDispatch {
  setCurSongIdx: typeof setCurSongIdx;
}

type MiniPlayerProps = MiniPlayerConnectedState & MiniPlayerConnectedDispatch;

const MiniPlayer = (props: MiniPlayerProps) => {
  const { preferDarkTheme, playing, curSongIdx, setCurSongIdx } = props;
  const ytPlayerRef = useRef<any>(null);
  const [curDisplayIdx, setCurDisplayIdx] = useState(curSongIdx);
  const listToPlaySnippets = useSelector(selectNormListToPlayResultSnippets);

  const currentSnippet = listToPlaySnippets[curSongIdx];

  const songListLen = listToPlaySnippets.length;
  const [blurBg, setBlurBg] = useState(false);

  const [showYT, setShowYT] = useState(false);
  const [showLargePlaylist, setShowLargePlaylist] = useState(false);
  const transitions = useTransition(showLargePlaylist, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

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
    setCurSongIdx(curDisplayIdx);
  }, [curDisplayIdx, setCurSongIdx]);

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

  const handleShowLargePlaylist = useCallback((e) => {
    e.preventDefault();
    setShowLargePlaylist(true);
    setBlurBg(true);
  }, []);

  const handleHideLargePlaylist = useCallback((e) => {
    e.preventDefault();
    setShowLargePlaylist(false);
    setBlurBg(false);
  }, []);

  // set shortcut to close YT overlay
  useKeyDown(setEscOverlay(handleHideYT));

  useEffect(() => {
    setCurDisplayIdx(curSongIdx);
  }, [curSongIdx]);

  useEffect(() => {
    return () => {
      setCurSongIdx(0);
    };
  }, [setCurSongIdx]);

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
            <button onClick={handleShowLargePlaylist}>
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
              <LargePlaylist
                handleHideLargePlaylist={handleHideLargePlaylist}
                curSongIdx={curSongIdx}
                listToPlaySnippets={listToPlaySnippets}
                playing={playing}
                setCurSongIdx={setCurSongIdx}
              />
            </animated.div>
          )
      )}
    </React.Fragment>
  );
};

const mapStatesToProps = (state: AppState) => ({
  preferDarkTheme: state.userPreferences.preferDarkTheme,
  playing: state.ytplayer.playing,
  curSongIdx: state.ytplayer.curSongIdx,
});

export default connect(
  mapStatesToProps,
  {
    setCurSongIdx,
  }
)(MiniPlayer);
