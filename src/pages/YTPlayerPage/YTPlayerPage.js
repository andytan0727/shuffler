import React from "react";
import TopBar from "../../components/BarComponents/TopBar";
import VideoPlayer from "../../components/VideoPlayer";

import styles from "./styles.module.scss";

const YTPlayerPage = () => {
  return (
    <React.Fragment>
      <TopBar />
      <div className={styles.ytPlayerDiv}>
        <h1>Youtube</h1>
        <VideoPlayer />
        <div className={styles.ctrlBtnGroup}>
          <button>Play</button>
          <button>Random</button>
          <button>Shuffle</button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default YTPlayerPage;
