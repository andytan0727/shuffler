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

const PlayerDropdown = () => {
  return (
    <div className={styles.dropdown}>
      <NavLink className={styles.dropdownItemParent} to={defaultPlayerPgUrl}>
        Player <ArrowDropDownIcon />
      </NavLink>

      <div className={styles.dropdownItem}>
        <NavLink to={defaultPlayerPgUrl}>YT Player</NavLink>
        <NavLink to="/player/miniplayer">Mini Player</NavLink>
      </div>
    </div>
  );
};

const TopBarNavItems: React.FunctionComponent = () => {
  return (
    <ul className={styles.navItems}>
      <li>
        <PlaylistInputDropdown />
      </li>
      <li>
        <PlayerDropdown />
      </li>
      <li>
        <NavLink to="/about">About</NavLink>
      </li>
    </ul>
  );
};

export default TopBarNavItems;
