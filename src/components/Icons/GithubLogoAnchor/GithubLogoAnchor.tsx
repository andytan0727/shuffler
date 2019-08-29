import { ReactComponent as GithubLogo } from "assets/githubLogo.svg";
import React from "react";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  githubLogoAnchor: {
    height: 48,

    "& svg": {
      width: 46,
      height: 46,

      "&:hover": {
        "& path": {
          fill: theme.palette.primary.main,
        },
      },

      "& path": {
        fill: "var(--text-color)",
      },
    },
  },
}));

const GithubLogoAnchor = () => {
  const classes = useStyles();

  return (
    <a
      href="https://github.com/andytan0727/yt_random_player"
      target="_blank"
      rel="noopener noreferrer"
      className={classes.githubLogoAnchor}
    >
      <GithubLogo />
    </a>
  );
};

export default GithubLogoAnchor;
