import novideo from "assets/novideo.svg";
import { SearchPlaylistBtn } from "components/Buttons";
import React from "react";

import styles from "./styles.module.scss";

const NoVideoFound = () => (
  <div className={styles.noVideo}>
    <div className={styles.noVideoTitleDiv}>
      <h2>
        <span role="img" aria-label="no-video-found">
          ⚠️
        </span>
        No Video Found. Add some playlist?
      </h2>
      <SearchPlaylistBtn />
    </div>

    <img src={novideo} alt="no video" />
  </div>
);

export default NoVideoFound;
