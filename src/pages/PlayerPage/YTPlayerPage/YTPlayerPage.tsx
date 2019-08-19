import VideoPlayer from "components/Players/Video/VideoPlayer";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurSongIdx } from "store/ytplayer/action";
import { selectCurSongIdx } from "store/ytplayer/selector";
import { selectListToPlayResultSnippets } from "store/ytplaylist/listToPlaySelectors";

import NoVideoFound from "../NoVideoFound";
import PlayerPageList from "./PlayerPageList";
import styles from "./styles.module.scss";

const YTPlayerPage = () => {
  const curSongIdx = useSelector(selectCurSongIdx);
  const listToPlaySnippets = useSelector(selectListToPlayResultSnippets);
  const dispatch = useDispatch();
  const currentSnippet = listToPlaySnippets[curSongIdx];

  useEffect(() => {
    // reset curSongIdx to prevent bugs when routing pages
    dispatch(setCurSongIdx(0));

    return () => {
      // also reset curSongIdx and document title when un-mounting
      dispatch(setCurSongIdx(0));
      document.title = "Shuffler";
    };
  }, [dispatch]);

  return (
    <React.Fragment>
      {listToPlaySnippets.length !== 0 ? (
        <div className={styles.ytPlayerDiv}>
          <div id="vid-wrapper" className={styles.player}>
            <h3 className={styles.videoTitle}>
              {currentSnippet && currentSnippet.title}
            </h3>
            <VideoPlayer />
          </div>
          <div className={styles.playlist}>
            <PlayerPageList />
          </div>
        </div>
      ) : (
        <NoVideoFound />
      )}
    </React.Fragment>
  );
};

export default YTPlayerPage;
