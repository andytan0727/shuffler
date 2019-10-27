import { ReactComponent as ShufflerLogo } from "assets/shufflerLogoLarge.svg";
import { ChangelogModal } from "components/Dialog";
import React from "react";
import { useSelector } from "react-redux";
import { selectLatestAppVersion } from "store/appGeneral/selector";

import { Typography } from "@material-ui/core";

import styles from "./styles.module.scss";

const AboutPage = () => {
  const latestVersion = useSelector(selectLatestAppVersion);

  return (
    <div className={styles.aboutDiv}>
      <div>
        <ShufflerLogo className={styles.shufflerLogo} />
      </div>
      <main>
        <div className={styles.header}>
          <Typography variant="h3">Shuffler</Typography>
          <Typography
            style={{
              marginLeft: "1.2rem",
            }}
            variant="subtitle1"
            color="textSecondary"
          >
            {`v${latestVersion}`}
          </Typography>

          <div
            style={{
              marginLeft: "auto",
            }}
          ></div>
          <ChangelogModal />
        </div>
        <p>
          Another simple and modern YouTube randomizer that shuffles your
          YouTube playlists.
        </p>
        <br />
        <hr />
        {new Date().getUTCFullYear()} &copy; Andy Tan
      </main>
    </div>
  );
};

export default AboutPage;
