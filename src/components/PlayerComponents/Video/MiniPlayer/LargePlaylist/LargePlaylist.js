import React, { useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import CloseIcon from "@material-ui/icons/Close";
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import { setEscOverlay } from "../../../../../utils/helper/keyboardShortcutHelper";

import styles from "./styles.module.scss";

const LargePlaylist = (props) => {
  const {
    handleHideLargePlaylist,
    preferDarkTheme,
    curSongIdx,
    listToPlay,
    setCurSongIdx,
  } = props;
  const listRef = useRef(null);
  const listLen = listToPlay.length;
  const displayList = listToPlay.slice(curSongIdx + 1, listLen);

  const handleClickSong = (e) => {
    const songToPlay = e.currentTarget.getAttribute("data-index");
    setCurSongIdx(parseInt(songToPlay));
  };

  const handleScrollToListTop = () => {
    listRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // set shortcut to close LargePlaylist overlay
  setEscOverlay(handleHideLargePlaylist);

  return (
    <div
      className={classNames({
        [styles.largePlaylistDivDark]: preferDarkTheme,
        [styles.largePlaylistDivLight]: !preferDarkTheme,
      })}
    >
      <button className={styles.closeButton} onClick={handleHideLargePlaylist}>
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
        <button
          className={styles.scrollTopFab}
          color="primary"
          onClick={handleScrollToListTop}
        >
          <KeyboardArrowUp />
        </button>
        {listLen !== 0 && (
          <ul ref={listRef}>
            {displayList.map((song, idx) => (
              <li
                key={song.id}
                className={styles.song}
                onClick={handleClickSong}
                data-index={curSongIdx + 1 + idx}
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
      </div>
    </div>
  );
};

LargePlaylist.propTypes = {
  handleHideLargePlaylist: PropTypes.func.isRequired,
  preferDarkTheme: PropTypes.bool.isRequired,
  curSongIdx: PropTypes.number.isRequired,
  listToPlay: PropTypes.array.isRequired,
  playing: PropTypes.bool.isRequired,
  setCurSongIdx: PropTypes.func.isRequired,
};

export default LargePlaylist;
