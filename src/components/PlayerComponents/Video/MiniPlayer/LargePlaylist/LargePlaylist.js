import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import CloseIcon from "@material-ui/icons/Close";

import styles from "./styles.module.scss";

const LargePlaylist = (props) => {
  const {
    handleShowLargePlaylist,
    preferDarkTheme,
    curSongIdx,
    listToPlay,
    playing,
    setCurSongIdx,
  } = props;
  const scrollThumb = useRef(null);
  const [curDisplayIdx, setCurDisplayIdx] = useState(curSongIdx);
  const listLen = listToPlay.length;

  const handlePlaylistScrolling = (e) => {
    const deltaY = e.deltaY;

    if (deltaY > 0 && curDisplayIdx < listLen - 5) {
      setCurDisplayIdx(curDisplayIdx + 1);
      scrollThumb.current.style.top = `${(curDisplayIdx / listLen) * 100}%`;
      return;
    }

    // if (deltaY < 0 && curDisplayIdx > curSongIdx) {
    if (deltaY < 0 && curDisplayIdx > 0) {
      setCurDisplayIdx(curDisplayIdx - 1);
      scrollThumb.current.style.top = `${((curDisplayIdx - 1) / listLen) *
        100}%`;
    }
  };

  const handleClickSong = (e) => {
    const songToPlay = e.currentTarget.getAttribute("data-index");
    setCurSongIdx(parseInt(songToPlay));
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
        {listLen !== 0 && (
          <ul onWheel={handlePlaylistScrolling}>
            {listToPlay
              .slice(curDisplayIdx + 1, curDisplayIdx + 5)
              .map((song, idx) => (
                <li
                  key={song.id}
                  className={styles.song}
                  onClick={handleClickSong}
                  data-index={curDisplayIdx + 1 + idx}
                >
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
          <div
            ref={scrollThumb}
            style={{
              height: `${100 - ((listLen - 6) / listLen) * 100}%`,
            }}
          />
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
  setCurSongIdx: PropTypes.func.isRequired,
};

export default LargePlaylist;
