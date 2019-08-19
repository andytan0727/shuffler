import { PlayerBasicCtrlBtnGroup } from "components/Buttons";
import YouTubeIFrame from "components/Players/YouTubeIFrame";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { selectListToPlayResultSnippets } from "store/ytplaylist/listToPlaySelectors";

import styles from "./styles.module.scss";

const VideoPlayer = () => {
  const ytPlayer = useRef<any>(null);
  const listToPlaySnippets = useSelector(selectListToPlayResultSnippets);

  return (
    <React.Fragment>
      {listToPlaySnippets.length !== 0 && (
        <div className={styles.playerWrapper}>
          <YouTubeIFrame ref={ytPlayer} />
          <PlayerBasicCtrlBtnGroup ytPlayerRef={ytPlayer} />
        </div>
      )}
    </React.Fragment>
  );
};

export default VideoPlayer;
