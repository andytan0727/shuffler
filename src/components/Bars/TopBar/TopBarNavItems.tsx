import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./styles.module.scss";

const defaultPlaylistInputPgUrl = "/panel";
const defaultPlayerPgUrl = "/player/ytplayer";

const TopBarNavItems: React.FC = () => {
  return (
    <ul className={styles.navItems}>
      <li>
        <NavLink to={defaultPlaylistInputPgUrl}>Playlist</NavLink>
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
