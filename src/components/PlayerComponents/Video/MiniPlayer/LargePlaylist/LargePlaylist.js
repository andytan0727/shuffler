import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import CloseIcon from "@material-ui/icons/Close";
import { useSprings, animated, interpolate, useSpring } from "react-spring";

import styles from "./styles.module.scss";

const LargePlaylist = (props) => {
  const {
    handleShowLargePlaylist,
    preferDarkTheme,
    curSongIdx,
    listToPlay,
    playing,
  } = props;

  const [curDisplayIdx, setCurDisplayIdx] = useState(curSongIdx);

  const handlePlaylistScrolling = (e) => {
    const deltaY = e.deltaY;

    if (deltaY > 0 && curDisplayIdx < listToPlay.length - 5) {
      console.log("scrolling down");
      console.log(curDisplayIdx);
      setCurDisplayIdx(curDisplayIdx + 1);
    }

    if (deltaY < 0 && curDisplayIdx > curSongIdx) {
      console.log("scrolling up");
      console.log(curDisplayIdx);
      setCurDisplayIdx(curDisplayIdx - 1);
    }
  };

  useEffect(() => {
    setCurDisplayIdx(curSongIdx);
  }, [curSongIdx]);

  return (
    <div
      className={classNames({
        [styles.largePlaylistDivDark]: preferDarkTheme,
        [styles.largePlaylistDivLight]: !preferDarkTheme,
      })}
    >
      <button className={styles.closeButton} onClick={handleShowLargePlaylist}>
        <CloseIcon />
      </button>
      <div className={styles.nowPlaying}>
        <img
          src={listToPlay[curSongIdx].snippet.thumbnails.high.url}
          alt="thumbnail"
        />
        <h3>{listToPlay[curSongIdx].snippet.title}</h3>
      </div>
      <div className={styles.list}>
        {listToPlay.length !== 0 && (
          <ul onWheel={handlePlaylistScrolling}>
            {listToPlay
              .slice(curDisplayIdx + 1, curDisplayIdx + 5)
              .map((song) => (
                <li key={song.id} className={styles.song}>
                  <img
                    src={song.snippet.thumbnails.default.url}
                    alt="thumbnail"
                  />
                  <span>{song.snippet.title}</span>
                </li>
              ))}
          </ul>
        )}
        <div className={styles.progress}>
          <div />
        </div>
      </div>
    </div>
  );
};

LargePlaylist.propTypes = {
  handleShowLargePlaylist: PropTypes.func.isRequired,
  preferDarkTheme: PropTypes.bool.isRequired,
  curSongIdx: PropTypes.number.isRequired,
  listToPlay: PropTypes.array.isRequired,
  playing: PropTypes.bool.isRequired,
};

export default LargePlaylist;
