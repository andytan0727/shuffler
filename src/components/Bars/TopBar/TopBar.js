import React, { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";

// Material Components
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { ReactComponent as ShufflerTextLogo } from "../../../assets/shufflerTextLogo.svg";
import { ReactComponent as GithubLogo } from "../../../assets/githubLogo.svg";

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

  const handleMenuClose = useCallback((e) => {
    setAnchorEl(null);
  }, []);

  return (
    <div className={styles.navDark}>
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
                  What's New
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
