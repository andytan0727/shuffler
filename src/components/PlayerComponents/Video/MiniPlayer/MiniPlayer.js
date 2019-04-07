import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import MusicVideoIcon from "@material-ui/icons/MusicVideo";
import PlayCircleIcon from "@material-ui/icons/PlayCircleFilled";
import ListIcon from "@material-ui/icons/List";
import CloseIcon from "@material-ui/icons/Close";
import { useTransition, animated } from "react-spring";
import YouTubeIFrame from "../../YouTubeIFrame";
import PlayerBasicCtrlBtnGroup from "../../../ButtonComponents/PlayerBasicCtrlBtnGroup";
import LargePlaylist from "./LargePlaylist";

import styles from "./styles.module.scss";
import { setCurSongIdx } from "../../../../store/ytplayer/action";
import { setEscOverlay } from "../../../../utils/helper/keyboardShortcutHelper";

const MiniPlayer = (props) => {
  const {
    userPreferences: { preferDarkTheme },
    ytplayer: { playing, curSongIdx },
    ytplaylist: { listToPlay },
    setCurSongIdx,
  } = props;
  const ytPlayerRef = useRef(null);
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

  const handleWheel = (e) => {
    const deltaY = e.deltaY;

    if (deltaY > 0 && curDisplayIdx < listToPlay.length - 1) {
      setCurDisplayIdx(curDisplayIdx + 1);
    }

    if (deltaY < 0 && curDisplayIdx > 0) {
      setCurDisplayIdx(curDisplayIdx - 1);
    }
  };

  const handlePlayClicked = () => {
    setCurSongIdx(curDisplayIdx);
  };

  const handleSetCurDisplayIdx = (e) => {
    e.preventDefault();
    setCurDisplayIdx(curSongIdx);
  };

  const handleShowYT = (e) => {
    e.preventDefault();
    setShowYT(true);
    setBlurBg(true);
  };

  const handleHideYT = (e) => {
    e.preventDefault();
    setShowYT(false);
    setBlurBg(false);
  };

  const handleShowLargePlaylist = (e) => {
    e.preventDefault();
    setShowLargePlaylist(true);
    setBlurBg(true);
  };

  const handleHideLargePlaylist = (e) => {
    e.preventDefault();
    setShowLargePlaylist(false);
    setBlurBg(false);
  };

  // set shortcut to close YT overlay
  setEscOverlay(handleHideYT);

  useEffect(() => {
    setCurDisplayIdx(curSongIdx);
  }, [curSongIdx]);

  useEffect(() => {
    return () => {
      setCurSongIdx(0);
    };
  }, []);

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
                preferDarkTheme={preferDarkTheme}
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

MiniPlayer.propTypes = {
  userPreferences: PropTypes.object.isRequired,
  ytplayer: PropTypes.object.isRequired,
  ytplaylist: PropTypes.object.isRequired,
  setVideoPlaying: PropTypes.func,
};

const mapStatesToProps = ({ userPreferences, ytplayer, ytplaylist }) => ({
  userPreferences,
  ytplayer,
  ytplaylist,
});

export default connect(
  mapStatesToProps,
  {
    setCurSongIdx,
  }
)(MiniPlayer);
