import React, { useRef, useState, useEffect, useCallback } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { useTransition, animated } from "react-spring";
import {
  PlayArrow as PlayArrowIcon,
  MusicVideo as MusicVideoIcon,
  PlayCircleFilled as PlayCircleIcon,
  List as ListIcon,
  Close as CloseIcon,
} from "@material-ui/icons";

import YouTubeIFrame from "components/Players/YouTubeIFrame";
import { PlayerBasicCtrlBtnGroup } from "components/Buttons";
import { LargePlaylist } from "components/Lists";
import { AppState } from "store";
import { ListToPlayItems } from "store/ytplaylist/types";
import { selectListToPlay } from "store/ytplaylist/selector";
import { setCurSongIdx } from "store/ytplayer/action";
import { useKeyDown, setEscOverlay } from "utils/helper/keyboardShortcutHelper";

import styles from "./styles.module.scss";

interface MiniPlayerConnectedState {
  preferDarkTheme: boolean;
  playing: boolean;
  curSongIdx: number;
  listToPlay: ListToPlayItems;
}

interface MiniPlayerConnectedDispatch {
  setCurSongIdx: typeof setCurSongIdx;
}

type MiniPlayerProps = MiniPlayerConnectedState & MiniPlayerConnectedDispatch;

const MiniPlayer = (props: MiniPlayerProps) => {
  const {
    preferDarkTheme,
    playing,
    curSongIdx,
    listToPlay,
    setCurSongIdx,
  } = props;
  const ytPlayerRef = useRef<any>(null);
  const curSong = listToPlay[curSongIdx];
  const songListLen = listToPlay.length;
  const [blurBg, setBlurBg] = useState(false);
  const [curDisplayIdx, setCurDisplayIdx] = useState(curSongIdx);
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

      if (deltaY > 0 && curDisplayIdx < listToPlay.length - 1) {
        setCurDisplayIdx(curDisplayIdx + 1);
      }

      if (deltaY < 0 && curDisplayIdx > 0) {
        setCurDisplayIdx(curDisplayIdx - 1);
      }
    },
    [curDisplayIdx, listToPlay.length]
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
          <h3>{curSong.snippet.title}</h3>
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
              backgroundImage: `url(${curSong.snippet.thumbnails.high.url})`,
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
              {listToPlay[curDisplayIdx - 2] &&
                listToPlay[curDisplayIdx - 2].snippet.title}
            </li>
            <li>
              {listToPlay[curDisplayIdx - 1] &&
                listToPlay[curDisplayIdx - 1].snippet.title}
            </li>
            <li
              className={classNames({
                [styles.curSongPlaying]:
                  playing && curSongIdx === curDisplayIdx,
              })}
              onClick={handlePlayClicked}
            >
              {curSongIdx === curDisplayIdx && playing && <PlayArrowIcon />}
              {listToPlay[curDisplayIdx] &&
                listToPlay[curDisplayIdx].snippet.title}
            </li>
            <li>
              {listToPlay[curDisplayIdx + 1] &&
                listToPlay[curDisplayIdx + 1].snippet.title}
            </li>
            <li>
              {listToPlay[curDisplayIdx + 2] &&
                listToPlay[curDisplayIdx + 2].snippet.title}
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
                listToPlay={listToPlay}
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
  listToPlay: selectListToPlay(state),
});

export default connect(
  mapStatesToProps,
  {
    setCurSongIdx,
  }
)(MiniPlayer);