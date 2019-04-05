import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import { ReactComponent as ShufflerTextLogo } from "../../../assets/shufflerTextLogo.svg";
import { ReactComponent as GithubLogo } from "../../../assets/githubLogo.svg";

import styles from "./styles.module.scss";

const muiStyles = (theme) => ({
  menuAnchor: {
    textDecoration: "none",
    color: theme.palette.primary.main,
  },
});

const TopBar = (props) => {
  const { classes, preferDarkTheme } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const matchesMobile = useMediaQuery("(max-width: 420px)");

  const handleMenuButtonClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e) => {
    setAnchorEl(null);
  };

  return (
    <div className={preferDarkTheme ? styles.navDark : styles.mainNavDiv}>
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
                  <div
                    className={classNames(styles.playerDropDownItem, {
                      [styles.playerDropDownItemDark]: preferDarkTheme,
                    })}
                  >
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

const mapStatesToProps = ({ userPreferences: { preferDarkTheme } }) => ({
  preferDarkTheme,
});

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
  preferDarkTheme: PropTypes.bool.isRequired,
};

export default connect(
  mapStatesToProps,
  {}
)(withStyles(muiStyles)(TopBar));
