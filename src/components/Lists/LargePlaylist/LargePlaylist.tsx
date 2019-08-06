import classNames from "classnames";
import React, { useCallback, useRef } from "react";
import { setCurSongIdx } from "store/ytplayer/action";
import { ListToPlayItems } from "store/ytplaylist/types";
import { setEscOverlay, useKeyDown } from "utils/helper/keyboardShortcutHelper";

import {
  Close as CloseIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@material-ui/icons";

import styles from "./styles.module.scss";

interface LargePlaylistProps {
  curSongIdx: number;
  listToPlay: ListToPlayItems;
  playing: boolean;
  setCurSongIdx: typeof setCurSongIdx;
  handleHideLargePlaylist: (e?: React.KeyboardEvent) => void;
}

const LargePlaylist = (props: LargePlaylistProps) => {
  const {
    handleHideLargePlaylist,
    curSongIdx,
    listToPlay,
    setCurSongIdx,
  } = props;
  const listRef = useRef<any>(null);
  const listLen = listToPlay.length;
  const displayList = listToPlay.slice(curSongIdx + 1, listLen);

  const handleClickSong = useCallback(
    (e) => {
      const songToPlay = e.currentTarget.getAttribute("data-index");
      setCurSongIdx(parseInt(songToPlay));
    },
    [setCurSongIdx]
  );

  const handleScrollToListTop = useCallback(() => {
    listRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // set shortcut to close LargePlaylist overlay
  useKeyDown(setEscOverlay(handleHideLargePlaylist));

  return (
    <div className={styles.largePlaylistDiv}>
      <button
        className={styles.closeButton}
        onClick={useCallback((e) => handleHideLargePlaylist(e), [
          handleHideLargePlaylist,
        ])}
      >
        <CloseIcon />
      </button>
      <div className={styles.nowPlaying}>
        {listToPlay[curSongIdx].snippet.thumbnails ? (
          <img
            className={styles.nowPlayingThumbnail}
            src={listToPlay[curSongIdx].snippet.thumbnails!.high.url}
            alt="thumbnail"
          />
        ) : (
          <div
            className={classNames(
              styles.nowPlayingThumbnail,
              styles.deletedVideo
            )}
          ></div>
        )}
        <h3>{listToPlay[curSongIdx].snippet.title}</h3>
      </div>
      <div className={styles.list}>
        <button
          className={styles.scrollTopFab}
          color="primary"
          onClick={handleScrollToListTop}
        >
          <KeyboardArrowUpIcon />
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
                {song.snippet.thumbnails ? (
                  <img
                    className={styles.thumbnail}
                    src={song.snippet.thumbnails.default.url}
                    alt="thumbnail"
                  />
                ) : (
                  <div className={styles.deletedVideoThumbnail}></div>
                )}
                <span>{song.snippet.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LargePlaylist;
