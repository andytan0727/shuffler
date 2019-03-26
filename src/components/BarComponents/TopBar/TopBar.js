import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";

import { ReactComponent as ShufflerTextLogo } from "../../../assets/shufflerTextLogo.svg";
import styles from "./styles.module.scss";

const muiStyles = () => ({
  menuAnchor: {
    textDecoration: "none"
  }
});

const TopBar = props => {
  const { classes } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuButtonClick = e => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = e => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.mainNavDiv}>
      <nav>
        <Link to="/">
          <ShufflerTextLogo className={styles.logo} />
        </Link>
        <Link to="/playlistInput">Playlist</Link>
        <Link to="/about">About</Link>
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
              <Link className={classes.menuAnchor} to="/playlistInput">
                Playlist
              </Link>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Link className={classes.menuAnchor} to="/about">
                About
              </Link>
            </MenuItem>
          </Menu>
        </div>
      </nav>
    </div>
  );
};

TopBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(muiStyles)(TopBar);
