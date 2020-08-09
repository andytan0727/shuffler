import React from "react";
import { NavLink } from "react-router-dom";

import { ArrowDropDown as ArrowDropDownIcon } from "@material-ui/icons";

import styles from "./styles.module.scss";

const defaultPlaylistInputPgUrl = "/panel";
const defaultPlayerPgUrl = "/player/ytplayer";

const PlaylistInputDropdown = () => {
  return (
    <div className={styles.dropdown}>
      <NavLink
        className={styles.dropdownItemParent}
        to={defaultPlaylistInputPgUrl}
      >
        Playlist <ArrowDropDownIcon />
      </NavLink>

      <div className={styles.dropdownItem}>
        <NavLink to="/tabs">Tabs</NavLink>
        <NavLink to={defaultPlaylistInputPgUrl}>Panel</NavLink>
      </div>
    </div>
  );
};

const TopBarNavItems: React.FC = () => {
  return (
    <ul className={styles.navItems}>
      <li>
        <PlaylistInputDropdown />
      </li>
      <li>
        <NavLink to={defaultPlayerPgUrl}>Player</NavLink>
      </li>
      <li>
        <NavLink to="/about">About</NavLink>
      </li>
    </ul>
  );
};

export default TopBarNavItems;
