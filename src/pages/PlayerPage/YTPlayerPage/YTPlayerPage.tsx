import React, { useEffect } from "react";
import { connect } from "react-redux";
import { DeepReadonly } from "utility-types";
import { AppState } from "store";
import { setCurSongIdx } from "store/ytplayer/action";
import { PlaylistItem, VideoItem } from "store/ytplaylist/types";
import { selectListToPlay } from "store/ytplaylist/selector";
import VideoPlayer from "components/Players/Video/VideoPlayer";
import PlayerPageList from "./PlayerPageList";
import NoVideoFound from "../NoVideoFound";

import styles from "./styles.module.scss";

interface YTPlayerPageConnectedState {
  curSongIdx: number;
  listToPlay: DeepReadonly<(PlaylistItem | VideoItem)[]>;
}

interface YTPlayerPageConnectedDispatch {
  setCurSongIdx: typeof setCurSongIdx;
}

type YTPlayerPageProps = YTPlayerPageConnectedState &
  YTPlayerPageConnectedDispatch;

const YTPlayerPage = (props: YTPlayerPageProps) => {
  const { curSongIdx, listToPlay, setCurSongIdx } = props;

  useEffect(() => {
    // reset curSongIdx to prevent bugs when routing pages
    setCurSongIdx(0);

    return () => {
      // also reset curSongIdx when un-mounting
      setCurSongIdx(0);
    };
  }, [setCurSongIdx]);

  return (
    <React.Fragment>
      {listToPlay.length !== 0 ? (
        <div className={styles.ytPlayerDiv}>
          <div id="vid-wrapper" className={styles.player}>
            <h3 className={styles.videoTitle}>
              {listToPlay[curSongIdx].snippet.title}
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
  listToPlay: selectListToPlay(state),
});

export default connect(
  mapStateToProps,
  {
    setCurSongIdx,
  }
)(YTPlayerPage);
