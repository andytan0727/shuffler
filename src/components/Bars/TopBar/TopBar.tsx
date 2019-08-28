import { ReactComponent as GithubLogo } from "assets/githubLogo.svg";
import { ReactComponent as ShufflerTextLogo } from "assets/shufflerTextLogo.svg";
import { ToggleDarkModeSwitch } from "components/Switches";
import React from "react";
import { NavLink } from "react-router-dom";

import { ArrowDropDown as ArrowDropDownIcon } from "@material-ui/icons";

import styles from "./styles.module.scss";

const TopBar = () => {
  return (
    <div className={styles.nav}>
      <nav>
        <NavLink to="/">
          <ShufflerTextLogo className={styles.logo} />
        </NavLink>

        <ul className={styles.navItems}>
          <li>
            <NavLink activeClassName={styles.curActivePg} to="/what-is-new">
              What&apos;s New
            </NavLink>
          </li>
          <li>
            <div className={styles.playerDropDown}>
              Playlist <ArrowDropDownIcon />
              <div className={styles.playerDropDownItem}>
                <NavLink to="/playlistInput/tabs">Tabs</NavLink>
                <NavLink to="/playlistInput/panel">Panel</NavLink>
              </div>
            </div>
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
          <li
            style={{
              marginRight: "auto",
            }}
          ></li>
          <li>
            <ToggleDarkModeSwitch />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TopBar;
