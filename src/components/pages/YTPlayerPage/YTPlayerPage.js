import React from "react";
import YoutubePlayerIFrame from "../../YoutubePlayerIFrame";

import styles from "./styles.module.scss";

const YTPlayerPage = () => {
  return (
    <React.Fragment>
      <div className={styles.ytPlayerDiv}>
        <h1>Youtube</h1>
        <YoutubePlayerIFrame />
        <div className={styles.ctrlBtnGroup}>
          <button>Loop</button>
          <button>Random</button>
          <button>Shuffle</button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default YTPlayerPage;
