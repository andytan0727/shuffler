import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as ShufflerTextLogo } from "../../../assets/shufflerTextLogo.svg";
import styles from "./styles.module.scss";

const TopBar = () => {
  return (
    <div className={styles.mainNavDiv}>
      <nav>
        <ShufflerTextLogo className={styles.logo} />
        {/* <Link to="/">Logo</Link> */}

        <Link to="/playlistInput">Playlist</Link>
        <Link to="/about">About</Link>
      </nav>
    </div>
  );
};

// export default withStyles(styles)(SearchAppBar);
export default TopBar;
