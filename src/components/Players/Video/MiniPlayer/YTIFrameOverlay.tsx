import classNames from "classnames";
import { PlayerBasicCtrlBtnGroup } from "components/Buttons";
import YouTubeIFrame from "components/Players/YouTubeIFrame";
import React from "react";
import YouTube from "react-youtube";

import { Close as CloseIcon } from "@material-ui/icons";

import styles from "./ytIFrameOverlayStyles.module.scss";

interface YTIFrameOverlay {
  showYT: boolean;
  handleHideYTOverlay: (e: OnClickEvent) => void;
  ytPlayerRef: React.Ref<YouTube>;
}

const YTIFrameOverlay = (props: YTIFrameOverlay) => {
  const { handleHideYTOverlay, showYT, ytPlayerRef } = props;

  return (
    <div
      className={classNames({
        [styles.hideYTIframe]: !showYT,
        [styles.showYTIframe]: showYT,
      })}
    >
      <button className={styles.closeButton} onClick={handleHideYTOverlay}>
        <CloseIcon />
      </button>
      <div className={styles.ytIframe}>
        <YouTubeIFrame ref={ytPlayerRef} />
        <PlayerBasicCtrlBtnGroup ytPlayerRef={ytPlayerRef} />
      </div>
    </div>
  );
};

export default YTIFrameOverlay;
