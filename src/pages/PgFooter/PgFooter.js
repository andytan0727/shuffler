import React from "react";
import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

const PgFooter = () => (
  <footer className={styles.footer}>
    <div className={styles.navPanel}>
      <p>YT Randomizer</p>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/playlistInput">Playlist</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </div>
    <div className={styles.copyright}>&copy; 2019 Andy Tan</div>
  </footer>
);

export default PgFooter;
