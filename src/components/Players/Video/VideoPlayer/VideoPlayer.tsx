import { PlayerBasicCtrlBtnGroup } from "components/Buttons";
import YouTubeIFrame from "components/Players/YouTubeIFrame";
import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { AppState } from "store";
import { selectListToPlay } from "store/ytplaylist/selector";
import { ListToPlayItems } from "store/ytplaylist/types";

import styles from "./styles.module.scss";

interface VideoPlayerConnectedState {
  listToPlay: ListToPlayItems;
}

type VideoPlayerProps = VideoPlayerConnectedState;

const VideoPlayer = (props: VideoPlayerProps) => {
  const { listToPlay } = props;
  const ytPlayer = useRef<any>(null);

  useEffect(() => {
    // fix exhaustive-deps rule of react-hooks
    // ensure ytPlayer.current points to the correct node in the cleanup function
    const ytPlayerRef = ytPlayer.current;

    return () => {
      // Destroy player when unmount

      if (ytPlayerRef) ytPlayerRef.internalPlayer.destroy();
    };
  }, []);

  return (
    <React.Fragment>
      {listToPlay.length !== 0 && (
        <div className={styles.playerWrapper}>
          <YouTubeIFrame ref={ytPlayer} />
          <PlayerBasicCtrlBtnGroup ytPlayerRef={ytPlayer} />
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    listToPlay: selectListToPlay(state),
  };
};

export default connect(
  mapStateToProps,
  {}
)(VideoPlayer);
