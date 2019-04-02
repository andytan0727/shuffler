import React from "react";
import { ReactComponent as ShufflerLogo } from "../../assets/shufflerLogoLarge.svg";
import Typography from "@material-ui/core/Typography";

import styles from "./styles.module.scss";

const AboutPage = () => {
  return (
    <div className={styles.aboutDiv}>
      <div>
        <ShufflerLogo className={styles.shufflerLogo} />
      </div>
      <main>
        <Typography variant="h3">Shuffler</Typography>
        <p>
          Another simple and modern YouTube randomizer that shuffles your
          YouTube playlists.
        </p>
        <br />
        <hr />
        2019 &copy; Andy Tan
      </main>
    </div>
  );
};

export default AboutPage;
