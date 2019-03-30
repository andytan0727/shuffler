import React from "react";

import styles from "./styles.module.scss";

const HelpGuide = () => (
  <div className={styles.guideDiv}>
    <h3>
      <span role="img" aria-label="how-to-use">
        ❓{" "}
      </span>
      How To Use:
    </h3>
    <ul>
      <li>
        If you are new user, input YouTube playlist url as mentioned and press
        search button.
      </li>
      <br />
      <li>
        After you pressed the search button, Shuffler will fetch and save the
        YouTube playlist by using YouTube Data API v3 to your machine for future
        usage.
      </li>
      <br />
      <li>
        There is a two-tab panel showing your playlist collections:
        <br />
        <br />
        <ul>
          <li>
            <strong>Saved:</strong> Playlist(s) saved to your machine.
          </li>
          <li>
            <strong>Playing: </strong> List of videos to be played. (All your
            initially fetched playlists will be <strong>added</strong> to your
            playing list)
          </li>
        </ul>
      </li>
      <br />
      <li>
        You may play, shuffler or add one or more playlist as you wish before
        you proceed to play your Playing list.{" "}
        <span role="img" aria-label="enjoy">
          Enjoy 🚀
        </span>
        .
      </li>
    </ul>
  </div>
);

export default HelpGuide;
