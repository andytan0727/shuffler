import React from "react";

import styles from "./styles.module.scss";

const HelpGuide = () => (
  <div className={styles.guideDiv}>
    <h3>How To Use:</h3>
    <ul>
      <li>
        If you are new user, input YouTube playlist or video url as mentioned
        and press search. Shuffler will take care the rest for you.
      </li>
      <br />
      <li>
        After you pressed the search button, Shuffler will fetch and save the
        YouTube playlist/video from YouTube Data API v3 to your machine for
        future usage.
      </li>
      <br />
      <li>
        There is a two-tab panel shows up when fetching process is finished.
        <br />
        <br />
        <ul>
          <li>
            <strong>Saved:</strong> Playlist(s) saved to your machine.
          </li>
          <li>
            <strong>Playing: </strong> Currently playing playlist, a.k.a the
            combined playlist from your saved playlist(s).
          </li>
        </ul>
      </li>
      <br />
      <li>
        You may play, shuffler or add more playlist or video as you wish before
        you proceed to play your Playing playlist. Enjoy.
      </li>
    </ul>
  </div>
);

export default HelpGuide;
