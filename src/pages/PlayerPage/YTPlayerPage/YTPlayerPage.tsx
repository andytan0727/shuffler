import VideoPlayer from "components/Players/Video/VideoPlayer";
import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { AppState } from "store";
import { setCurSongIdx } from "store/ytplayer/action";
import { selectNormListToPlayResultSnippets } from "store/ytplaylist/normSelector";

import NoVideoFound from "../NoVideoFound";
import PlayerPageList from "./PlayerPageList";
import styles from "./styles.module.scss";

interface YTPlayerPageConnectedState {
  curSongIdx: number;
}

interface YTPlayerPageConnectedDispatch {
  setCurSongIdx: typeof setCurSongIdx;
}

type YTPlayerPageProps = YTPlayerPageConnectedState &
  YTPlayerPageConnectedDispatch;

const YTPlayerPage = (props: YTPlayerPageProps) => {
  const { curSongIdx, setCurSongIdx } = props;
  const listToPlaySnippets = useSelector(selectNormListToPlayResultSnippets);
  const currentSnippet = listToPlaySnippets[curSongIdx];

  useEffect(() => {
    // reset curSongIdx to prevent bugs when routing pages
    setCurSongIdx(0);

    return () => {
      // also reset curSongIdx and document title when un-mounting
      setCurSongIdx(0);
      document.title = "Shuffler";
    };
  }, [setCurSongIdx]);

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

const mapStateToProps = (state: AppState) => ({
  curSongIdx: state.ytplayer.curSongIdx,
});

export default connect(
  mapStateToProps,
  {
    setCurSongIdx,
  }
)(YTPlayerPage);
