import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

const TopBar = () => {
  return (
    <div className={styles.mainNavDiv}>
      <nav>
        <Link to="/">YT Randomizer</Link>
        <Link to="/playlistInput">Playlist</Link>
        <Link to="/player">Player</Link>
        <Link to="/about">About</Link>
      </nav>
    </div>
  );
};

// export default withStyles(styles)(SearchAppBar);
export default TopBar;
