import React, { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu as MenuIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@material-ui/icons";
import {
  IconButton,
  MenuItem,
  Menu,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core";

import { ReactComponent as ShufflerTextLogo } from "assets/shufflerTextLogo.svg";
import { ReactComponent as GithubLogo } from "assets/githubLogo.svg";

import styles from "./styles.module.scss";

const useStyles = makeStyles((theme) => ({
  menuAnchor: {
    textDecoration: "none",
    color: theme.palette.primary.main,
  },
}));

const TopBar = () => {
  const classes = useStyles({});
  const [anchorEl, setAnchorEl] = useState(null);
  const matchesMobile = useMediaQuery("(max-width: 420px)");

  const handleMenuButtonClick = useCallback((e) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <div className={styles.nav}>
      <nav>
        <NavLink to="/">
          <ShufflerTextLogo className={styles.logo} />
        </NavLink>
        {matchesMobile ? (
          <div>
            <IconButton
              className={styles.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={handleMenuButtonClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <NavLink className={classes.menuAnchor} to="/playlistInput">
                  Playlist
                </NavLink>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <NavLink className={classes.menuAnchor} to="/about">
                  About
                </NavLink>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <a
                  className={classes.menuAnchor}
                  href="https://github.com/andytan0727/yt_random_player"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubLogo className={styles.githubLogo} /> Github
                </a>
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <React.Fragment>
            <ul className={styles.navItems}>
              <li>
                <NavLink activeClassName={styles.curActivePg} to="/what-is-new">
                  What&apos;s New
                </NavLink>
              </li>
              <li>
                <NavLink
                  activeClassName={styles.curActivePg}
                  to="/playlistInput"
                >
                  Playlist
                </NavLink>
              </li>
              <li>
                <div className={styles.playerDropDown}>
                  Player <ArrowDropDownIcon />
                  <div className={styles.playerDropDownItem}>
                    <NavLink to="/player/ytplayer">YT Player</NavLink>
                    <NavLink to="/player/miniplayer">Mini Player</NavLink>
                  </div>
                </div>
              </li>
              <li>
                <NavLink activeClassName={styles.curActivePg} to="/about">
                  About
                </NavLink>
              </li>
              <li>
                <a
                  href="https://github.com/andytan0727/yt_random_player"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubLogo className={styles.githubLogo} />
                </a>
              </li>
            </ul>
          </React.Fragment>
        )}
      </nav>
    </div>
  );
};

export default TopBar;
