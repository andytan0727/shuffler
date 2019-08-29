import React from "react";
import { NavLink } from "react-router-dom";

import { ArrowDropDown as ArrowDropDownIcon } from "@material-ui/icons";

import styles from "./styles.module.scss";

const TopBarNavItems: React.FunctionComponent = () => {
  return (
    <ul className={styles.navItems}>
      <li>
        <NavLink to="/what-is-new">What&apos;s New</NavLink>
      </li>
      <li>
        <div className={styles.dropdown}>
          Playlist <ArrowDropDownIcon />
          <div className={styles.dropdownItem}>
            <NavLink to="/playlistInput/tabs">Tabs</NavLink>
            <NavLink to="/playlistInput/panel">Panel</NavLink>
          </div>
        </div>
      </li>
      <li>
        <div className={styles.dropdown}>
          Player <ArrowDropDownIcon />
          <div className={styles.dropdownItem}>
            <NavLink to="/player/ytplayer">YT Player</NavLink>
            <NavLink to="/player/miniplayer">Mini Player</NavLink>
          </div>
        </div>
      </li>
      <li>
        <NavLink to="/about">About</NavLink>
      </li>
    </ul>
  );
};

export default TopBarNavItems;
