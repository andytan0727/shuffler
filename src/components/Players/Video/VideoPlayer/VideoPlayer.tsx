import { PlayerBasicCtrlBtnGroup } from "components/Buttons";
import YouTubeIFrame from "components/Players/YouTubeIFrame";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { selectListToPlayResultSnippets } from "store/ytplaylist/listToPlaySelectors";

const VideoPlayer = () => {
  const ytPlayer = useRef<any>(null);
  const listToPlaySnippets = useSelector(selectListToPlayResultSnippets);

  return listToPlaySnippets.length !== 0 ? (
    <React.Fragment>
      <YouTubeIFrame ref={ytPlayer} />
      <PlayerBasicCtrlBtnGroup ytPlayerRef={ytPlayer} />
    </React.Fragment>
  ) : (
    <div>Unable to load video</div>
  );
};

export default VideoPlayer;
