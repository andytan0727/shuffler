import novideo from "assets/novideo.svg";
import React from "react";

import styles from "./styles.module.scss";

const NoVideoFound = () => (
  <div className={styles.noVideo}>
    <h2>
      <span role="img" aria-label="no-video-found">
        ⚠️
      </span>
      No Video Found
    </h2>
    <img src={novideo} alt="no video" />
  </div>
);

export default NoVideoFound;
